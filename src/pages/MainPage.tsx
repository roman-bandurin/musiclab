import { useEffect } from 'react'
import { authClient } from '@/lib/auth-client'
import { setSessionRef } from '@/lib/session-ref'
import { MainPageLayout } from './MainPageLayout'
import './Main.css'

export default function MainPage () {
  const {
    data: session, refetch: refetchSession,
  } = authClient.useSession()

  useEffect(
    () => {
      setSessionRef(session)
    },
    [session],
  )

  const handleSignOut = async () => {
    await authClient.signOut()
    setSessionRef(null)
    await refetchSession()
  }

  return <MainPageLayout onLogout={handleSignOut} />
}
