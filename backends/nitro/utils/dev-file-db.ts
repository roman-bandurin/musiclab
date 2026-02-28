/**
 * Dev-only: чтение/очистка backends/nitro/auth-db.json для GET/DELETE /api/users.
 * Тот же файл, что использует file-auth-adapter.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const FILE_PATH = join(
  process.cwd(),
  'backends',
  'nitro',
  'auth-db.json',
)

const DEFAULT_DB = {
  user: [],
  account: [],
  session: [],
  verification: [],
}

export async function getFileAuthData (): Promise<{ user: Array<Record<string, unknown>>; devPasswords: Record<string, string> }> {
  try {
    const raw = await readFile(
      FILE_PATH,
      'utf-8',
    )
    const parsed = JSON.parse(raw) as Record<string, unknown[]>
    const user = (parsed.user ?? []) as Array<Record<string, unknown>>
    return {
      user, devPasswords: {},
    }
  } catch {
    return {
      user: [], devPasswords: {},
    }
  }
}

export async function clearFileAuthData (): Promise<void> {
  await mkdir(
    join(
      process.cwd(),
      'backends',
      'nitro',
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
