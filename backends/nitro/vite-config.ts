/**
 * Частичный Vite-конфиг для бекенда Nitro: прокси /api на VITE_API_URL.
 */

import type { UserConfig } from 'vite'

export function getNitroViteConfig (env: Record<string, string>): UserConfig {
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
