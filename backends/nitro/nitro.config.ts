import type { NitroConfig } from 'nitropack'

/** Конфиг Nitro: при запуске из корня проекта подключается через root nitro.config.ts с srcDir: 'backends/nitro'. */
export default {
  compatibilityDate: '2026-02-10',
  // Порт задаётся через NITRO_PORT или CLI: npm run dev:server -- --port 3000
} satisfies NitroConfig
