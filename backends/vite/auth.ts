/**
 * Better Auth для Vite dev server. Тот же стек, что Nitro: file adapter, bearer, authFormatPlugin.
 * Данные в backends/vite/auth-db.json.
 */

import type { BetterAuthOptions } from '@better-auth/core'
import { betterAuth } from 'better-auth'
import { bearer } from 'better-auth/plugins/bearer'
import { join } from 'node:path'
import { createFileAuthAdapter } from '../nitro/utils/file-auth-adapter'
import { authFormatPlugin } from '../nitro/utils/auth-format-plugin'
import { trustedOrigins } from '../nitro/utils/trusted-origins'

const fileAuthAdapter = createFileAuthAdapter(
  join(
    process.cwd(),
    'backends',
    'vite',
    'auth-db.json',
  ),
)

export const auth = betterAuth({
  database: (opts: BetterAuthOptions) => fileAuthAdapter(opts),
  emailAndPassword: { enabled: true },
  plugins: [bearer(), authFormatPlugin()],
  baseURL: process.env.VITE_API_URL ?? process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [...trustedOrigins()],
})
