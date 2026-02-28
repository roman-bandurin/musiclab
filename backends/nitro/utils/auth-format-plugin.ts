/**
 * Плагин Better Auth: переводит формат ответов в стиль file/MSW и api/auth.ts.
 * - Успех sign-in/sign-up: { token, user } → { user, session: { id, userId, token, expiresAt } }
 * - Ошибки: нормализация в { error: { message } } или { code, message }
 */

import type { BetterAuthPlugin } from '@better-auth/core'

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000

function isSignInSignUpSuccess (body: unknown): body is { token: string; user: Record<string, unknown> } {
  return (
    typeof body === 'object'
    && body !== null
    && 'token' in body
    && typeof (body as { token: unknown }).token === 'string'
    && 'user' in body
    && typeof (body as { user: unknown }).user === 'object'
  )
}

function toFileFormat (data: { token: string; user: Record<string, unknown> }) {
  const userId = (data.user as { id?: string }).id ?? ''
  const sessionId = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS)
  return {
    user: {
      ...data.user, password: undefined,
    },
    session: {
      id: sessionId,
      userId,
      token: data.token,
      expiresAt,
    },
    token: data.token, // для совместимости с Better Auth client
  }
}

function normalizeErrorBody (body: unknown): object {
  if (typeof body !== 'object' || body === null) {
    return { error: { message: 'An error occurred' } }
  }
  const obj = body as Record<string, unknown>
  if (obj.error && typeof obj.error === 'object' && obj.error !== null) {
    return body as object // уже { error: { message } }
  }
  const message =
    (obj.message as string)
    ?? ((obj.error as Record<string, unknown>)?.message as string)
    ?? (obj.error as string)
    ?? 'An error occurred'
  return { error: { message } }
}

export const authFormatPlugin = (): BetterAuthPlugin => ({
  id: 'auth-format',
  onResponse: async (response, _ctx) => {
    const contentType = response.headers.get('content-type') ?? ''
    if (!contentType.includes('application/json')) return { response }

    let body: unknown
    try {
      body = await response.clone()
        .json()
    } catch {
      return { response }
    }

    // Успешный sign-in / sign-up: { token, user } → { user, session, token }
    if (response.ok && isSignInSignUpSuccess(body)) {
      const transformed = toFileFormat(body)
      return {
        response: new Response(
          JSON.stringify(transformed),
          {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
          },
        ),
      }
    }

    // Ошибки 4xx: нормализация формата в { error: { message } }
    if (response.status >= 400 && response.status < 500) {
      const normalized = normalizeErrorBody(body)
      return {
        response: new Response(
          JSON.stringify(normalized),
          {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
          },
        ),
      }
    }

    return { response }
  },
})
