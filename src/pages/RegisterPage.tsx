import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function RegisterPage () {
  const navigate = useNavigate()
  const { refetch: refetchSession } = authClient.useSession()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const result = await authClient.signUp.email({
      name: name.trim(),
      email: email.trim(),
      password,
    })
    const err = 'error' in result
      ? result.error
      : null
    if (err) setError((err as { message?: string }).message ?? 'Ошибка регистрации')
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
          type="text"
          placeholder="Имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
          className="mb-[30px]"
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          autoComplete="new-password"
          className="mb-[30px]"
        />
        <Input
          type="password"
          name="confirm-password"
          placeholder="Повторите пароль"
          autoComplete="new-password"
          className="mb-[60px]"
          aria-label="Повторите пароль"
        />
        {error && <p className="mb-2 w-full text-sm text-red-600">{error}</p>}
        <Button type="submit" className="mb-0">
          Зарегистрироваться
        </Button>
        <Link to="/login" className="mt-5 block w-full cursor-pointer">
          <Button type="button" variant="secondary" className="w-full">
            Уже есть аккаунт? Войти
          </Button>
        </Link>
      </form>
    </div>
  )
}
