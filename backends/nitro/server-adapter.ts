/**
 * Серверный адаптер Nitro: формат «бэкенда» (Fastify-стиль) → Better Auth.
 * Ключ — метод + путь входящего запроса, значение — path/method/body для Better Auth.
 */

const AUTH_PREFIX = '/api/auth'

export type RouteRule = {
  authPath: string
  method: 'GET' | 'POST'
  bodyTransform?: (rawBody: string | undefined) => string | undefined
}

function passBody (raw: string | undefined): string | undefined {
  return raw
}

function registerBody (raw: string | undefined): string | undefined {
  if (!raw) return undefined
  try {
    const data = JSON.parse(raw) as { email?: string; password?: string; name?: string }
    return JSON.stringify({
      email: data.email ?? '',
      password: data.password ?? '',
      name: data.name ?? data.email ?? '',
    })
  } catch {
    return raw
  }
}

/** Правила: "METHOD /path" → { authPath, method, bodyTransform? } */
export const serverAuthRoutes: Record<string, RouteRule> = {
  'POST /api/login': {
    authPath: `${AUTH_PREFIX}/sign-in/email`,
    method: 'POST',
    bodyTransform: passBody,
  },
  'POST /api/register': {
    authPath: `${AUTH_PREFIX}/sign-up/email`,
    method: 'POST',
    bodyTransform: registerBody,
  },
  'GET /api/logout': {
    authPath: `${AUTH_PREFIX}/sign-out`,
    method: 'POST',
  },
}

export function getServerAuthRule (
  method: string,
  path: string,
): RouteRule | undefined {
  return serverAuthRoutes[`${method} ${path}`]
}
