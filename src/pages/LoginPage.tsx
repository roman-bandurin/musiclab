import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage () {
  const navigate = useNavigate()
  const { refetch: refetchSession } = authClient.useSession()
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const result = await authClient.signIn.email({
      email: login.trim(),
      password,
    })
    const err = 'error' in result
      ? result.error
      : null
    if (err) setError((err as { message?: string }).message ?? 'Ошибка входа')
    else {
      await refetchSession()
      navigate(
        '/',
        { replace: true },
      )
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#000000d9]">
      <form
        method="post"
        autoComplete="on"
        className="flex min-w-[366px] flex-col items-center rounded-xl bg-white p-[47px_41px]"
        onSubmit={handleSubmit}
      >
        <div
          className="mb-5 h-12 w-12 rounded-xl border-none bg-gradient-to-br from-[#bf6ecc] to-[#4c2cbb]"
          aria-hidden
        />
        <Input
          type="email"
          placeholder="Логин"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
          autoComplete="email"
          className="mb-[30px]"
        />
        <Input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="mb-[30px]"
        />
        {error && <p className="mb-2 w-full text-sm text-red-600">{error}</p>}
        <Button type="submit" className="mb-5">
          Войти
        </Button>
        <Link to="/register" className="block w-full cursor-pointer">
          <Button type="button" variant="secondary" className="w-full">
            Зарегистрироваться
          </Button>
        </Link>
      </form>
    </div>
  )
}
