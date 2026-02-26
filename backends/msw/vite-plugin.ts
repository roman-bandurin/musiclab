/**
 * Vite-плагин: копирует mockServiceWorker.js из backends/msw в public,
 * подставляя VITE_API_ORIGIN из VITE_API_URL.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { loadEnv } from 'vite'
import type { Plugin, UserConfig } from 'vite'

const PLACEHOLDER = '__VITE_API_ORIGIN__'

function copyWorker (): void {
  const root = process.cwd()
  const src = join(
    root,
    'backends',
    'msw',
    'mockServiceWorker.js',
  )
  const dest = join(
    root,
    'public',
    'mockServiceWorker.js',
  )
  if (!existsSync(src)) return
  const env = loadEnv(
    process.env.MODE ?? 'development',
    root,
    '',
  )
  const apiOrigin = (env.VITE_API_URL ?? '').trim()
  let content = readFileSync(
    src,
    'utf8',
  )
  content = content.replaceAll(
    PLACEHOLDER,
    apiOrigin,
  )
  writeFileSync(
    dest,
    content,
  )
}

export function mswCopyWorkerPlugin (): Plugin {
  return {
    name: 'msw-copy-worker',
    buildStart: copyWorker,
    configureServer () {
      copyWorker()
    },
  }
}

export function getMswViteConfig (_env?: Record<string, string>): UserConfig {
  return { plugins: [mswCopyWorkerPlugin()] }
}
