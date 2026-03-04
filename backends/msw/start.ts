/**
 * Запуск MSW worker при VITE_AUTH_BACKEND=msw.
 * Вызывается из main.tsx до первого рендера, чтобы первый get-session шёл в воркер (200 OK, а не 304).
 * serviceWorker.url с base — чтобы на GitHub Pages (scope /musiclab/) запросы перехватывались.
 */

import { getMswWorkerScriptUrl } from '../../src/lib/msw-worker-url'
import { worker } from './handlers'

export async function prepare (): Promise<void> {
  await worker.start({
    serviceWorker: { url: getMswWorkerScriptUrl() },
    onUnhandledRequest: 'bypass',
    quiet: true,
  })
  if (typeof window !== 'undefined') {
    (window as unknown as { __MSW_STARTED?: boolean }).__MSW_STARTED = true
  }
}
