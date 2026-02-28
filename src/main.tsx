import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

async function bootstrap () {
  if (import.meta.env.VITE_AUTH_BACKEND === 'msw') {
    const { prepare } = await import('../backends/msw/start')
    await prepare()
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
