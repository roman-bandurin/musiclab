/**
 * Dev-only: чтение backends/vite/auth-db.json для /api/me и /api/users (GET, DELETE).
 * Тот же файл, что использует Better Auth file adapter.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const FILE_PATH = join(
  process.cwd(),
  'backends',
  'vite',
  'auth-db.json',
)

const DEFAULT_DB = {
  user: [],
  account: [],
  session: [],
  verification: [],
}

const COOKIE_NAME = 'better-auth.session_token'

export function getTokenFromRequest (req: { headers: Record<string, string | string[] | undefined> }): string | null {
  const auth = req.headers.authorization
  if (typeof auth === 'string' && auth.startsWith('Bearer ')) return auth.slice(7)
    .trim()
  const cookie = req.headers.cookie
  if (typeof cookie === 'string') {
    const match = cookie.match(
      new RegExp(`${COOKIE_NAME.replace(
        /\./g,
        '\\.',
      )}=([^;]+)`),
    )
    if (match) return decodeURIComponent(match[1])
  }
  const x = req.headers['x-msw-session-token']
  return Array.isArray(x)
    ? x[0]?.trim() ?? null
    : (x as string)?.trim() ?? null
}

export async function getFileAuthData (): Promise<{
  user: Array<Record<string, unknown>>
  session: Array<Record<string, unknown>>
}> {
  try {
    const raw = await readFile(
      FILE_PATH,
      'utf-8',
    )
    const parsed = JSON.parse(raw) as Record<string, unknown[]>
    return {
      user: (parsed.user ?? []) as Array<Record<string, unknown>>,
      session: (parsed.session ?? []) as Array<Record<string, unknown>>,
    }
  } catch {
    return {
      user: [], session: [],
    }
  }
}

export async function getSessionUser (req: { headers: Record<string, string | string[] | undefined> }): Promise<Record<string, unknown> | null> {
  const token = getTokenFromRequest(req)
    ?.trim()
  if (!token) return null
  const {
    user, session,
  } = await getFileAuthData()
  const sess = session.find((s) => (s.token as string) === token)
  if (!sess) return null
  const expiresAt = sess.expiresAt
  if (expiresAt && new Date(expiresAt as string) < new Date()) return null
  const userId = sess.userId
  const u = user.find((r) => r.id === userId)
  return u ?? null
}

export async function clearFileAuthData (): Promise<void> {
  await mkdir(
    join(
      process.cwd(),
      'backends',
      'vite',
    ),
    { recursive: true },
  )
  await writeFile(
    FILE_PATH,
    JSON.stringify(
      DEFAULT_DB,
      null,
      2,
    ),
    'utf-8',
  )
}
