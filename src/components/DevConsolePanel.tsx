/**
 * Регистрирует глобальные функции Protected API и выводит в консоль стилизованную панель
 * с подсказками по вызову. Рендер в UI не делает. Подключается на всех страницах.
 */

import { useEffect } from 'react'
import { authClient } from '../lib/auth-client'
import { setSessionRef, getTokenFromSession } from '../lib/session-ref'
import { fetchUsersApi, clearUsersApi, fetchProtectedApi } from '../lib/api-backend'

declare global {
  interface Window {
    __devActions?: {
      fetchUsers: () => Promise<void>;
      clearUsers: () => Promise<void>;
      fetchProtected: () => Promise<void>;
    };
  }
}

function printDevPanel () {
  const titleStyle = [
    'font-size: 14px; font-weight: bold; color: #1a1a1a;',
    'padding: 8px 12px; background: #e8f4fd; border-radius: 6px;',
    'border: 1px solid #0d6efd;',
  ].join(' ')
  const rowStyle = ['font-size: 12px; color: #333; padding: 4px 0;'].join(' ')
  const codeStyle = ['font-family: monospace; background: #f0f0f0; padding: 2px 6px;', 'border-radius: 4px; color: #c7254e;'].join(' ')

  console.log(
    '%c🎛 Dev Actions Panel',
    titleStyle,
  )
  console.log(
    '%cЗагрузить пользователей: %c__devActions.fetchUsers()',
    rowStyle,
    codeStyle,
  )
  console.log(
    '%cОчистить пользователей (dev): %c__devActions.clearUsers()',
    rowStyle,
    codeStyle,
  )
  console.log(
    '%cЗапрос /api/me: %c__devActions.fetchProtected()',
    rowStyle,
    codeStyle,
  )
}

export default function DevConsolePanel () {
  const { data: session } = authClient.useSession()

  useEffect(
    () => {
      setSessionRef(session)
    },
    [session],
  )

  useEffect(
    () => {
      const getAccessTokenRaw = (): (() => string | null) | undefined =>
        import.meta.env.VITE_AUTH_BACKEND === 'json-server'
          ? getTokenFromSession
          : 'getAccessToken' in authClient
            ? () => (authClient as unknown as { getAccessToken?: () => string | null }).getAccessToken?.() ?? null
            : undefined

      const getAccessToken = (): string | null => getAccessTokenRaw()?.() ?? null

      const getSession = () => (session?.user
        ? { user: { id: session.user.id } }
        : null)
      const getBearerToken = ['msw', 'vite'].includes(import.meta.env.VITE_AUTH_BACKEND as string)
        ? getTokenFromSession
        : undefined

      const fetchUsers = async () => {
        try {
          const {
            users: list, error,
          } = await fetchUsersApi(getAccessToken)
          if (error) console.error(
            '[Dev] fetchUsers error:',
            error,
          )
          else console.log(
            '[Dev] fetchUsers result:',
            list ?? [],
          )
        } catch (e) {
          console.error(
            '[Dev] fetchUsers:',
            e instanceof Error
              ? e.message
              : String(e),
          )
        }
      }

      const clearUsers = async () => {
        if (!confirm('Удалить всех пользователей, сессии и dev-пароли?')) return
        try {
          const {
            ok, error,
          } = await clearUsersApi(getAccessToken)
          if (ok) {
            console.log('[Dev] clearUsers: ok')
            if ([
              'msw',
              'vite',
              'json-server',
            ].includes(import.meta.env.VITE_AUTH_BACKEND as string)) setSessionRef(null)
          } else if (error) console.error(
            '[Dev] clearUsers error:',
            error,
          )
        } catch (e) {
          console.error(
            '[Dev] clearUsers:',
            e instanceof Error
              ? e.message
              : String(e),
          )
        }
      }

      const fetchProtected = async () => {
        try {
          const {
            data, error,
          } = await fetchProtectedApi(
            getAccessToken,
            getSession,
            getBearerToken,
          )
          if (error) console.error(
            '[Dev] fetchProtected error:',
            error,
          )
          else console.log(
            '[Dev] fetchProtected result:',
            data,
          )
        } catch (err) {
          console.error(
            '[Dev] fetchProtected:',
            err instanceof Error
              ? err.message
              : String(err),
          )
        }
      }

      const win = window as Window & { __devActions?: typeof window.__devActions }
      win.__devActions = {
        fetchUsers,
        clearUsers,
        fetchProtected,
      }

      printDevPanel()
    },
    [session],
  )

  return null
}
