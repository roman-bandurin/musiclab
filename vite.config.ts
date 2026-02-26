import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { getBackendViteConfig, mergeViteConfig } from './backends/vite-config'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return mergeViteConfig(
    {
      plugins: [react(), tailwindcss()],
      resolve: {
        alias: { '@': path.resolve(__dirname, './src') },
      },
    },
    getBackendViteConfig(env.VITE_AUTH_BACKEND ?? 'nitro', env)
  )
})
