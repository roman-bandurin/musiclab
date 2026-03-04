/**
 * URL for MSW Service Worker script. Use with worker.start({ serviceWorker: { url: getMswWorkerScriptUrl() } })
 * so the worker is loaded from the app base path (e.g. /musiclab/mockServiceWorker.js on GitHub Pages).
 * Only start the worker in dev or when VITE_AUTH_BACKEND is 'msw' to avoid registration errors in production.
 */
export function getMswWorkerScriptUrl (): string {
  const base = typeof import.meta.env?.BASE_URL === 'string'
    ? import.meta.env.BASE_URL
    : '/'
  return `${base.replace(
    /\/?$/,
    '/',
  )}mockServiceWorker.js`
}
