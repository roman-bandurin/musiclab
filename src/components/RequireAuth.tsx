import { useEffect, useRef } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { authClient } from '@/lib/auth-client'
import { getTokenFromSession } from '@/lib/session-ref'

/** Рендерит детей только при наличии сессии; иначе редирект на /login. */
export function RequireAuth ({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const {
    data: session, isPending, refetch: refetchSession,
  } = authClient.useSession()
  const refetchedOnce = useRef(false)
  const hasToken = getTokenFromSession()

  // Token in storage but session not in state yet: trigger refetch once so useSession can catch up
  useEffect(
    () => {
      if (isPending || session || refetchedOnce.current || !hasToken) return
      refetchedOnce.current = true
      refetchSession()
    },
    [
      isPending,
      session,
      refetchSession,
      hasToken,
    ],
  )

  if (isPending) {
    return (
      <p className="flex min-h-screen items-center justify-center text-white">
        Загрузка...
      </p>
    )
  }
  if (!session) {
    // Token in storage but useSession not updated yet (e.g. right after login + navigate)
    if (hasToken) {
      return (
        <p className="flex min-h-screen items-center justify-center text-white">
          Загрузка...
        </p>
      )
    }
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  // Токена в storage нет — сессия из useSession может быть устаревшей; не считаем пользователя авторизованным
  if (!hasToken) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return <>{children}</>
}
