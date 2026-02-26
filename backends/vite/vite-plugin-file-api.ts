/**
 * Vite plugin: Better Auth для /api/auth/* + dev-эндпоинты /api/me, /api/users.
 * Данные в backends/vite/auth-db.json (тот же file adapter, что в Nitro).
 */

import type { Plugin } from 'vite'
import { auth } from './auth'
import { getSessionUser, getFileAuthData, clearFileAuthData } from './vite-dev-auth'

function corsHeaders (origin: string | null, extra?: Record<string, string>) {
  return {
    'Access-Control-Allow-Origin': origin ?? '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-MSW-Session-Token',
    'Access-Control-Expose-Headers': 'set-auth-token',
    ...extra,
  }
}

function sendJson (
  res: {
    writeHead: (a: number, b: Record<string, string>) => void;
    end: (s: string) => void;
  },
  status: number,
  data: unknown,
  headers: Record<string, string>,
) {
  res.writeHead(
    status,
    {
      'Content-Type': 'application/json', ...headers,
    },
  )
  res.end(JSON.stringify(data))
}

function readBody (req: {
  on: (ev: string, fn: (...a: unknown[]) => void) => void;
}): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on(
      'data',
      (chunk: unknown) => {
        body += typeof chunk === 'string'
          ? chunk
          : (chunk as Buffer).toString()
      },
    )
    req.on(
      'end',
      () => resolve(body),
    )
    req.on(
      'error',
      reject,
    )
  })
}

export function vitePluginFileApi (): Plugin {
  return {
    name: 'file-api',
    configureServer (server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? ''
        if (!url.startsWith('/api')) return next()

        const origin = (req.headers.origin as string) ?? null
        const method = req.method ?? 'GET'

        if (method === 'OPTIONS') {
          res.writeHead(
            204,
            corsHeaders(origin),
          )
          res.end()
          return
        }

        try {
          // Better Auth: /api/auth/*
          if (url.startsWith('/api/auth/')) {
            const body =
              method !== 'GET' && method !== 'HEAD'
                ? await readBody(req)
                : undefined
            const baseUrl = `http://${req.headers.host ?? 'localhost'}`
            const request = new Request(
              baseUrl + url,
              {
                method,
                headers: new Headers(req.headers as Record<string, string>),
                body: body ?? undefined,
              },
            )
            const response = await auth.handler(request)
            const cors = corsHeaders(origin)
            const outHeaders: Record<string, string> = { ...cors }
            response.headers.forEach((v, k) => {
              outHeaders[k] = v
            })
            res.writeHead(
              response.status,
              response.statusText,
              outHeaders,
            )
            if (response.body) {
              const buf = await response.arrayBuffer()
              res.end(Buffer.from(buf))
            } else {
              res.end()
            }
            return
          }

          // /api/me
          if (method === 'GET' && url === '/api/me') {
            const user = await getSessionUser(req)
            if (!user) {
              sendJson(
                res,
                401,
                {
                  message: 'Unauthorized', _debug: { cause: 'no_token' },
                },
                corsHeaders(origin),
              )
              return
            }
            const {
              password: _, ...userOut
            } = user as Record<string, unknown> & {
              password?: string;
            }
            sendJson(
              res,
              200,
              {
                message: 'Protected data', user: userOut,
              },
              corsHeaders(origin),
            )
            return
          }

          // GET /api/users (dev)
          if (method === 'GET' && url === '/api/users') {
            const { user } = await getFileAuthData()
            const withPasswords = user.map((u) => {
              const {
                password: _p, ...rest
              } = u as Record<string, unknown> & {
                password?: string;
              }
              return {
                ...rest, rawPassword: null,
              }
            })
            sendJson(
              res,
              200,
              { users: withPasswords },
              corsHeaders(origin),
            )
            return
          }

          // DELETE /api/users (dev)
          if (method === 'DELETE' && url === '/api/users') {
            await clearFileAuthData()
            sendJson(
              res,
              200,
              {
                ok: true,
                message: 'All users, sessions, accounts and dev passwords cleared.',
              },
              corsHeaders(origin),
            )
            return
          }
        } catch (err) {
          console.error(
            '[vite-auth]',
            err,
          )
          res.writeHead(
            500,
            {
              'Content-Type': 'application/json',
              ...corsHeaders(origin),
            },
          )
          res.end(
            JSON.stringify({
              error: err instanceof Error
                ? err.message
                : 'Internal error',
            }),
          )
          return
        }

        next()
      })
    },
  }
}
