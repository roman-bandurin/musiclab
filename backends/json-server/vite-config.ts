/**
 * Частичный Vite-конфиг для бекенда json-server: прокси /api на VITE_API_URL.
 */

import type { UserConfig } from 'vite'

export function getJsonServerViteConfig (env: Record<string, string>): UserConfig {
  return {
    server: {
      proxy: env.VITE_API_URL
        ? {
          '/api': {
            target: env.VITE_API_URL,
            changeOrigin: true,
          },
        }
        : undefined,
    },
  }
}
