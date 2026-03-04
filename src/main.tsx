import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

async function bootstrap () {
  const backend = import.meta.env.VITE_AUTH_BACKEND
  if (backend === 'msw') {
    const { prepare } = await import('../backends/msw/start')
    await prepare()
  }
  if (typeof window !== 'undefined' && import.meta.env.DEV) {
    console.debug(
      '[musiclab] VITE_AUTH_BACKEND=',
      backend,
    )
  }
  createRoot(document.getElementById('root')!)
    .render(
      <StrictMode>
        <HashRouter>
          <App />
        </HashRouter>
      </StrictMode>,
    )
}

bootstrap()
