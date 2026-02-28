/**
 * Словарь бекендов → частичный Vite-конфиг (OCP: решение о плагинах и proxy делегировано бекендам).
 * В корневом vite.config мержим базовый конфиг с конфигом текущего бекенда по VITE_AUTH_BACKEND.
 */

import type { UserConfig } from 'vite'
import { getJsonServerViteConfig } from './json-server/vite-config'
import { getMswViteConfig } from './msw/vite-plugin'
import { getNitroViteConfig } from './nitro/vite-config'
import { getViteBackendConfig } from './vite/vite.config'

type BackendViteConfigGetter = (env: Record<string, string>) => UserConfig

const backendViteConfigs: Record<string, BackendViteConfigGetter> = {
  nitro: getNitroViteConfig,
  'json-server': getJsonServerViteConfig,
  vite: getViteBackendConfig as BackendViteConfigGetter,
  msw: getMswViteConfig as BackendViteConfigGetter,
}

export function getBackendViteConfig (
  backendName: string,
  env: Record<string, string>,
): UserConfig {
  const getter = backendViteConfigs[backendName]
  return getter?.(env) ?? {}
}

/**
 * Мерж двух конфигов: plugins конкатенируются, server и остальное перезаписываются через spread.
 */
export function mergeViteConfig (base: UserConfig, backend: UserConfig): UserConfig {
  return {
    ...base,
    ...backend,
    plugins: [...(base.plugins ?? []), ...(backend.plugins ?? [])],
    server: {
      ...base.server, ...backend.server,
    },
  }
}
