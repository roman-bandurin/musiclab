/**
 * Проксирует запрос к Better Auth handler с переводом пути и тела.
 * Обеспечивает на Nitro те же эндпоинты и форматы запроса/ответа (/register, /login, /logout, /refresh),
 * что и бекенд на Fastify (api/auth.ts).
 */

import { auth } from './auth'

function corsHeaders (origin: string | undefined) {
  const allowOrigin = origin ?? '*'
  const h = new Headers()
  h.set(
    'Access-Control-Allow-Origin',
    allowOrigin,
  )
  h.set(
    'Access-Control-Allow-Credentials',
    'true',
  )
  h.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  )
  h.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-MSW-Session-Token',
  )
  h.set(
    'Access-Control-Expose-Headers',
    'set-auth-token',
  )
  return h
}

export async function proxyToBetterAuth (
  event: H3Event,
  authPath: string,
  options?: { method?: string; body?: string },
): Promise<Response> {
  const url = getRequestURL(event)
  const method = options?.method ?? getMethod(event)
  const headers = getRequestHeaders(event)
  const origin = headers.origin

  const authUrl = new URL(
    authPath,
    url.origin,
  )
  const body = options?.body ?? (method !== 'GET' && method !== 'HEAD'
    ? await readRawBody(event)
    : undefined)

  const request = new Request(
    authUrl.href,
    {
      method, headers, body,
    },
  )
  const response = await auth.handler(request)

  const newHeaders = corsHeaders(origin)
  response.headers.forEach((v, k) => newHeaders.set(
    k,
    v,
  ))

  return new Response(
    response.body,
    {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    },
  )
}
