/**
 * Запуск MSW worker при VITE_AUTH_BACKEND=msw.
 * Вызывается из main.tsx до первого рендера, чтобы первый get-session шёл в воркер (200 OK, а не 304).
 */

import { worker } from './handlers'

export async function prepare (): Promise<void> {
  await worker.start({
    onUnhandledRequest: 'bypass',
    quiet: true,
  })
}
