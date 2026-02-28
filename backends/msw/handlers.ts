/**
 * MSW handlers и browser worker — API как у Nitro/Better Auth. Хранилище: IndexedDB.
 * Запускается при VITE_AUTH_BACKEND=msw.
 */

import { http, HttpResponse } from 'msw'
import { setupWorker } from 'msw/browser'
import bcrypt from 'bcryptjs'
import { getDb,
  getAllUsers,
  addUser,
  getUserByEmail,
  addSession,
  getSessionByToken,
  deleteSession,
  getDevPassword,
  setDevPassword,
  clearAll,
  type DbUser,
  type DbSession } from './db'

const COOKIE_NAME = 'better-auth.session_token' // fallback для Nitro/cookie

function getTokenFromRequest (request: Request): string | null {
  const auth = request.headers.get('Authorization')
  if (auth?.startsWith('Bearer ')) return auth.slice(7)
    .trim()
  const cookie = request.headers.get('Cookie')
  if (cookie) {
    const match = cookie.match(new RegExp(`${COOKIE_NAME.replace(
      /\./g,
      '\\.',
    )}=([^;]+)`))
    if (match) return decodeURIComponent(match[1])
  }
  return request.headers.get('X-MSW-Session-Token')
}

function corsHeaders (origin: string | null, extra?: Record<string, string>) {
  return {
    'Access-Control-Allow-Origin': origin ?? '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-MSW-Session-Token',
    'Access-Control-Expose-Headers': 'set-auth-token',
    'X-MSW-Response': '1',
    ...extra,
  }
}

function withSetAuthToken (token: string, origin: string | null) {
  return {
    ...corsHeaders(origin),
    'set-auth-token': token,
  }
}

export const handlers = [
  http.post(
    '/api/login',
    async ({ request }) => {
      const origin = request.headers.get('Origin')
      const body = (await request.json()) as { email?: string; password?: string }
      const {
        email, password,
      } = body
      if (!email || !password) {
        return HttpResponse.json(
          { error: { message: 'Invalid credentials' } },
          {
            status: 400, headers: corsHeaders(origin),
          },
        )
      }
      const db = await getDb()
      const user = await getUserByEmail(
        db,
        email,
      )
      if (!user) {
        return HttpResponse.json(
          { error: { message: 'Invalid email or password' } },
          {
            status: 401, headers: corsHeaders(origin),
          },
        )
      }
      const storedHash = (user as unknown as { password?: string }).password
      if (!storedHash || !(await bcrypt.compare(
        password,
        storedHash,
      ))) {
        return HttpResponse.json(
          { error: { message: 'Invalid email or password' } },
          {
            status: 401, headers: corsHeaders(origin),
          },
        )
      }
      const token = crypto.randomUUID()
      const session: DbSession = {
        id: crypto.randomUUID(),
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }
      await addSession(
        db,
        session,
      )
      const userData = {
        ...user, password: undefined,
      }
      return HttpResponse.json(
        {
          user: userData,
          session: {
            id: session.id, userId: user.id, token, expiresAt: session.expiresAt,
          },
          token,
        },
        {
          status: 200, headers: withSetAuthToken(
            token,
            origin,
          ),
        },
      )
    },
  ),

  http.post(
    '/api/register',
    async ({ request }) => {
      const origin = request.headers.get('Origin')
      const body = (await request.json()) as { name?: string; email?: string; password?: string }
      const {
        name, email, password,
      } = body
      if (!email || !password) {
        return HttpResponse.json(
          { error: { message: 'Email and password required' } },
          {
            status: 400, headers: corsHeaders(origin),
          },
        )
      }
      const db = await getDb()
      const existing = await getUserByEmail(
        db,
        email,
      )
      if (existing) {
        return HttpResponse.json(
          { error: { message: 'User already exists' } },
          {
            status: 400, headers: corsHeaders(origin),
          },
        )
      }
      const hashed = await bcrypt.hash(
        password,
        10,
      )
      const now = new Date()
      const user: DbUser & { password?: string } = {
        id: crypto.randomUUID(),
        email,
        name: name ?? email,
        emailVerified: false,
        createdAt: now,
        updatedAt: now,
        password: hashed,
      }
      await addUser(
        db,
        user,
      )
      await setDevPassword(
        db,
        email,
        password,
      )
      const token = crypto.randomUUID()
      const session: DbSession = {
        id: crypto.randomUUID(),
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }
      await addSession(
        db,
        session,
      )
      const {
        password: _, ...userOut
      } = user
      return HttpResponse.json(
        {
          user: userOut,
          session: {
            id: session.id, userId: user.id, token, expiresAt: session.expiresAt,
          },
          token,
        },
        {
          status: 200, headers: withSetAuthToken(
            token,
            origin,
          ),
        },
      )
    },
  ),

  http.post(
    '/api/logout',
    async ({ request }) => {
      const origin = request.headers.get('Origin')
      const token = getTokenFromRequest(request)
      if (token) {
        const db = await getDb()
        await deleteSession(
          db,
          token,
        )
      }
      return HttpResponse.json(
        { success: true },
        {
          status: 200, headers: corsHeaders(origin),
        },
      )
    },
  ),

  http.post(
    '/api/auth/sign-up/email',
    async ({ request }) => {
      const origin = request.headers.get('Origin')
      const body = (await request.json()) as { name?: string; email?: string; password?: string }
      const {
        name, email, password,
      } = body
      if (!email || !password) {
        return HttpResponse.json(
          { error: { message: 'Email and password required' } },
          {
            status: 400, headers: corsHeaders(origin),
          },
        )
      }
      const db = await getDb()
      const existing = await getUserByEmail(
        db,
        email,
      )
      if (existing) {
        return HttpResponse.json(
          { error: { message: 'User already exists' } },
          {
            status: 400, headers: corsHeaders(origin),
          },
        )
      }
      const hashed = await bcrypt.hash(
        password,
        10,
      )
      const now = new Date()
      const user: DbUser & { password?: string } = {
        id: crypto.randomUUID(),
        email,
        name: name ?? email,
        emailVerified: false,
        createdAt: now,
        updatedAt: now,
        password: hashed,
      }
      await addUser(
        db,
        user,
      )
      await setDevPassword(
        db,
        email,
        password,
      )
      const token = crypto.randomUUID()
      const session: DbSession = {
        id: crypto.randomUUID(),
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }
      await addSession(
        db,
        session,
      )
      const {
        password: _, ...userOut
      } = user
      return HttpResponse.json(
        {
          user: userOut, session: {
            id: session.id, userId: user.id, token, expiresAt: session.expiresAt,
          },
        },
        {
          status: 200,
          headers: withSetAuthToken(
            token,
            origin,
          ),
        },
      )
    },
  ),

  http.get(
    '/api/auth/get-session',
    async ({ request }) => {
      const origin = request.headers.get('Origin')
      const noStore = { 'Cache-Control': 'no-store' }
      const token = getTokenFromRequest(request)
      if (!token) {
        return HttpResponse.json(
          null,
          {
            status: 200,
            headers: {
              ...corsHeaders(origin),
              ...noStore,
            },
          },
        )
      }
      const db = await getDb()
      const session = await getSessionByToken(
        db,
        token,
      )
      if (!session || new Date(session.expiresAt) < new Date()) {
        return HttpResponse.json(
          null,
          {
            status: 200,
            headers: {
              ...corsHeaders(origin),
              ...noStore,
            },
          },
        )
      }
      const users = await db.getAll('users')
      const user = users.find((u) => u.id === session.userId)
      if (!user) {
        return HttpResponse.json(
          null,
          {
            status: 200,
            headers: {
              ...corsHeaders(origin),
              ...noStore,
            },
          },
        )
      }
      const {
        password: _, ...userOut
      } = user as DbUser & { password?: string }
      return HttpResponse.json(
        {
          user: userOut, session: {
            id: session.id, userId: session.userId,
          },
        },
        {
          status: 200,
          headers: {
            ...corsHeaders(origin),
            ...noStore,
          },
        },
      )
    },
  ),

  http.post(
    '/api/auth/sign-out',
    async ({ request }) => {
      const origin = request.headers.get('Origin')
      const token = getTokenFromRequest(request)
      if (token) {
        const db = await getDb()
        await deleteSession(
          db,
          token,
        )
      }
      return HttpResponse.json(
        { success: true },
        {
          status: 200, headers: corsHeaders(origin),
        },
      )
    },
  ),

  http.get(
    '/api/users',
    async ({ request }) => {
      const origin = request.headers.get('Origin')
      const db = await getDb()
      const users = await getAllUsers(db)
      const withPasswords = await Promise.all(
        users.map(async (u) => {
          const dev = await getDevPassword(
            db,
            u.email,
          )
          const {
            password: _p, ...rest
          } = u as DbUser & { password?: string }
          return {
            ...rest,
            rawPassword: dev?.password ?? null,
          }
        }),
      )
      return HttpResponse.json(
        { users: withPasswords },
        {
          status: 200, headers: corsHeaders(origin),
        },
      )
    },
  ),

  http.delete(
    '/api/users',
    async ({ request }) => {
      const origin = request.headers.get('Origin')
      const db = await getDb()
      await clearAll(db)
      return HttpResponse.json(
        {
          ok: true, message: 'All users, sessions, accounts and dev passwords cleared.',
        },
        {
          status: 200, headers: corsHeaders(origin),
        },
      )
    },
  ),

  http.get(
    '/api/me',
    async ({ request }) => {
      const origin = request.headers.get('Origin')
      let token = getTokenFromRequest(request)
      if (token) token = token.trim()
      const debug401 = (cause: string, extra?: object) =>
        ({
          message: 'Unauthorized', _debug: {
            cause, ...extra,
          },
        })
      if (!token) {
        return HttpResponse.json(
          debug401('no_token'),
          {
            status: 401, headers: corsHeaders(origin),
          },
        )
      }
      const db = await getDb()
      const session = await getSessionByToken(
        db,
        token,
      )
      const sessions = await db.getAll('sessions')
      if (!session || new Date(session.expiresAt) < new Date()) {
        return HttpResponse.json(
          debug401(
            'session_not_found',
            {
              tokenLen: token.length,
              sessionCount: sessions.length,
              dbTokens: sessions.map((s) => s.token.slice(
                0,
                8,
              )),
            },
          ),
          {
            status: 401, headers: corsHeaders(origin),
          },
        )
      }
      const users = await db.getAll('users')
      const user = users.find((u) => u.id === session.userId)
      if (!user) {
        return HttpResponse.json(
          debug401(
            'user_not_found',
            {
              sessionUserId: session.userId, userIds: users.map((u) => u.id),
            },
          ),
          {
            status: 401, headers: corsHeaders(origin),
          },
        )
      }
      const {
        password: _, ...userOut
      } = user as DbUser & { password?: string }
      return HttpResponse.json(
        {
          message: 'Protected data', user: userOut,
        },
        {
          status: 200, headers: corsHeaders(origin),
        },
      )
    },
  ),
]

export const worker = setupWorker(...handlers)
