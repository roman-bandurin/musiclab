import { Navigate } from 'react-router-dom'
import { authClient } from '@/lib/auth-client'
import { getTokenFromSession } from '@/lib/session-ref'

/** Рендерит детей только без сессии; иначе редирект на главную. */
export function RequireGuest ({ children }: { children: React.ReactNode }) {
  const {
    data: session, isPending,
  } = authClient.useSession()
  const hasToken = getTokenFromSession()

  const debug = (
    <pre className="fixed bottom-2 left-2 z-50 max-h-32 max-w-md overflow-auto rounded bg-black/80 p-2 text-xs text-green-400">
      {JSON.stringify(
        {
          isPending,
          hasSession: !!session,
        },
        null,
        2,
      )}
    </pre>
  )

  if (isPending) {
    return (
      <>
        {debug}
        <p className="flex min-h-screen items-center justify-center text-white">
          Загрузка сессии...
        </p>
      </>
    )
  }
  // Редирект на главную только при наличии и сессии, и токена (как в RequireAuth); иначе useSession может отдать устаревший session без токена — цикл редиректов
  if (session && hasToken) {
    return (
      <>
        {debug}
        <Navigate to="/" replace />
      </>
    )
  }
  return (
    <>
      {debug}
      {children}
    </>
  )
}
