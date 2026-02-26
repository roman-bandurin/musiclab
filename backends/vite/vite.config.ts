/**
 * Частичный Vite-конфиг для бекенда Vite (file-db API).
 * Подключается в корневом vite.config.ts при VITE_AUTH_BACKEND=vite.
 */

import type { UserConfig } from 'vite'
import { vitePluginFileApi } from './vite-plugin-file-api'

export function getViteBackendConfig (_env?: Record<string, string>): UserConfig {
  return {
    plugins: [vitePluginFileApi()],
    server: { proxy: undefined },
  }
}
