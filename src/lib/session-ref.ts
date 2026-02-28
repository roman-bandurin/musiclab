/**
 * Текущая сессия из authClient.useSession() — синхронный доступ для token() в fetchOptions.
 * App синхронизирует ref в useEffect при изменении session.
 */

type SessionData = {
  user?: { id?: string; name?: string; email?: string };
  session?: { accessToken?: string; token?: string; [k: string]: unknown };
} | null

const sessionRef = { current: null as SessionData }

export function getSessionRef (): { current: SessionData } {
  return sessionRef
}

export function setSessionRef (session: unknown): void {
  sessionRef.current = session as SessionData
}

const SESSION_STORAGE_TOKEN_KEY = 'accessToken'

export function getTokenFromSession (): string | null {
  const s = sessionRef.current?.session
  const token = (s as { accessToken?: string; token?: string } | undefined)?.accessToken
    ?? (s as { accessToken?: string; token?: string } | undefined)?.token
  if (token) return token
  if (typeof globalThis.sessionStorage !== 'undefined') {
    const stored = globalThis.sessionStorage.getItem(SESSION_STORAGE_TOKEN_KEY)
    if (stored) return stored
  }
  return null
}
