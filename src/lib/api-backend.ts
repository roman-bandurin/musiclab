/**
 * Бэкенд-специфичная логика для API (fetchUsers, clearUsers, handleProtected).
 * VITE_AUTH_BACKEND: nitro | json-server | msw | vite.
 */

const inBrowser = typeof window !== 'undefined'

/** URL API: msw/vite — origin; nitro в dev — '' (proxy); иначе VITE_API_URL. */
const API_URL: string | undefined = {
  msw: inBrowser
    ? window.location.origin
    : undefined,
  vite: inBrowser
    ? window.location.origin
    : undefined,
  nitro: import.meta.env.DEV && inBrowser
    ? ''
    : undefined,
  'json-server': undefined,
}[import.meta.env.VITE_AUTH_BACKEND ?? 'nitro'] ?? import.meta.env.VITE_API_URL

export const isJsonServerBackend = import.meta.env.VITE_AUTH_BACKEND === 'json-server'
export const isMswBackend = import.meta.env.VITE_AUTH_BACKEND === 'msw'
export const isViteBackend = import.meta.env.VITE_AUTH_BACKEND === 'vite'
export const JSON_SERVER_URL = import.meta.env.VITE_API_URL as string | undefined

type UserRow = { id?: number; email?: string; name?: string; password?: string }

export async function fetchUsersApi (
  getAccessToken: (() => string | null) | undefined,
): Promise<{ users: Array<{ name?: string; email?: string; rawPassword?: string }>; error?: string }> {
  if (isJsonServerBackend) {
    const token = getAccessToken?.()
    if (!token) return {
      users: [], error: 'Not authenticated',
    }
    const res = await fetch(
      `${JSON_SERVER_URL}/users`,
      { headers: { Authorization: `Bearer ${token}` } },
    )
    if (!res.ok) {
      const err = await res.json()
        .catch(() => ({}))
      return {
        users: [], error: (err as { message?: string }).message ?? res.statusText,
      }
    }
    const data = (await res.json()) as UserRow[] | { [key: string]: UserRow[] }
    const list = Array.isArray(data)
      ? data
      : (data.users ?? [])
    const users = list.map((u) => ({
      name: u.name ?? u.email,
      email: u.email,
      rawPassword: undefined,
    }))
    return { users }
  }

  const res = await fetch(`${API_URL}/api/users`)
  const data = (await res.json()) as { users?: Array<{ name?: string; email?: string; rawPassword?: string }>; error?: string }
  if (!res.ok) return {
    users: [], error: data?.error ?? res.statusText,
  }
  return { users: data.users ?? [] }
}

export async function clearUsersApi (
  getAccessToken: (() => string | null) | undefined,
): Promise<{ ok: boolean; error?: string; }> {
  if (isJsonServerBackend) {
    const token = getAccessToken?.()
    if (!token) return {
      ok: false, error: 'Not authenticated',
    }
    const resList = await fetch(
      `${JSON_SERVER_URL}/users`,
      { headers: { Authorization: `Bearer ${token}` } },
    )
    if (!resList.ok) return {
      ok: false, error: 'Failed to fetch users',
    }
    const list = (await resList.json()) as UserRow[]
    const ids = (Array.isArray(list)
      ? list
      : [])
      .map((u) => u.id)
      .filter((id): id is number => id != null)
    for (const id of ids) {
      const res = await fetch(
        `${JSON_SERVER_URL}/users/${id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      if (!res.ok) return {
        ok: false, error: `Failed to delete user ${id}`,
      }
    }
    return { ok: true }
  }

  const res = await fetch(
    `${API_URL}/api/users`,
    { method: 'DELETE' },
  )
  const data = (await res.json()) as { ok?: boolean; error?: string }
  return data.ok
    ? { ok: true }
    : {
      ok: false, error: data?.error ?? res.statusText,
    }
}

export async function fetchProtectedApi (
  getAccessToken: (() => string | null) | undefined,
  getSession: () => { user: { id: string } } | null,
  getBearerToken?: () => string | null,
): Promise<{ data: unknown; error?: string; }> {
  if (isJsonServerBackend) {
    const token = getAccessToken?.()
    const session = getSession()
    if (!token || !session) return {
      data: null, error: 'Not authenticated',
    }
    const res = await fetch(
      `${JSON_SERVER_URL}/users/${session.user.id}`,
      { headers: { Authorization: `Bearer ${token}` } },
    )
    if (!res.ok) {
      const err = await res.json()
        .catch(() => ({}))
      return {
        data: null, error: (err as { message?: string }).message ?? res.statusText,
      }
    }
    const data = await res.json()
    return {
      data: {
        message: 'Protected data (json-server)', user: data,
      },
    }
  }

  const headers: HeadersInit = {}
  const useBearer = isMswBackend || isViteBackend
  const bearerToken = useBearer
    ? getBearerToken?.() ?? null
    : null
  if (bearerToken) headers['Authorization'] = `Bearer ${bearerToken}`
  const apiUrl = API_URL
  const res = await fetch(
    `${apiUrl}/api/me`,
    {
      credentials: 'include', headers,
    },
  )
  const data = await res.json()
    .catch(() => ({}))
  if (!res.ok) {
    const d = data as { message?: string; _debug?: unknown }
    const fromMsw = res.headers.get('X-MSW-Response') === '1'
    const clientInfo = {
      clientHadToken: !!bearerToken, responseFromMsw: fromMsw,
    }
    const err = d?._debug
      ? `401: ${JSON.stringify({
        ...(d._debug as object), ...clientInfo,
      })}`
      : `${res.status}: ${d?.message ?? JSON.stringify(data)} (${JSON.stringify(clientInfo)})`
    return {
      data: null, error: err,
    }
  }
  return { data }
}
