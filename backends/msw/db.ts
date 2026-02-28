/**
 * IndexedDB store для MSW mock. Совместим со схемой Nitro (users, sessions, devPasswords).
 */

import { openDB } from 'idb'

const DB_NAME = 'musiclab-msw-db'
const DB_VERSION = 1

export type DbUser = {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  password?: string;
}

export type DbSession = {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
}

export type DevPassword = { email: string; password: string }

const storeNames = [
  'users',
  'sessions',
  'devPasswords',
] as const

export async function getDb () {
  return openDB(
    DB_NAME,
    DB_VERSION,
    {
      upgrade (db) {
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore(
            'users',
            { keyPath: 'id' },
          )
        }
        if (!db.objectStoreNames.contains('sessions')) {
          db.createObjectStore(
            'sessions',
            { keyPath: 'id' },
          )
        }
        if (!db.objectStoreNames.contains('devPasswords')) {
          db.createObjectStore(
            'devPasswords',
            { keyPath: 'email' },
          )
        }
      },
    },
  )
}

export async function getAllUsers (db: Awaited<ReturnType<typeof getDb>>) {
  return db.getAll('users')
}

export async function addUser (db: Awaited<ReturnType<typeof getDb>>, user: DbUser & { password?: string }) {
  await db.put(
    'users',
    user,
  )
}

export async function getUserByEmail (db: Awaited<ReturnType<typeof getDb>>, email: string) {
  const users = await db.getAll('users')
  return users.find((u) => u.email === email) ?? null
}

export async function getAllSessions (db: Awaited<ReturnType<typeof getDb>>) {
  return db.getAll('sessions')
}

export async function addSession (db: Awaited<ReturnType<typeof getDb>>, session: DbSession) {
  await db.put(
    'sessions',
    session,
  )
}

export async function getSessionByToken (db: Awaited<ReturnType<typeof getDb>>, token: string) {
  const sessions = await db.getAll('sessions')
  return sessions.find((s) => s.token === token) ?? null
}

export async function deleteSession (db: Awaited<ReturnType<typeof getDb>>, token: string) {
  const sessions = await db.getAll('sessions')
  const s = sessions.find((x) => x.token === token)
  if (s) await db.delete(
    'sessions',
    s.id,
  )
}

export async function getDevPassword (db: Awaited<ReturnType<typeof getDb>>, email: string) {
  return db.get(
    'devPasswords',
    email,
  )
}

export async function setDevPassword (db: Awaited<ReturnType<typeof getDb>>, email: string, password: string) {
  await db.put(
    'devPasswords',
    {
      email, password,
    },
  )
}

export async function clearAll (db: Awaited<ReturnType<typeof getDb>>) {
  const tx = db.transaction(
    storeNames,
    'readwrite',
  )
  await Promise.all(storeNames.map((name) => tx.objectStore(name)
    .clear()))
  await tx.done
}
