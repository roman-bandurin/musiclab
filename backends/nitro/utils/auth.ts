import type { BetterAuthOptions } from '@better-auth/core'
import { betterAuth } from 'better-auth'
import { bearer } from 'better-auth/plugins/bearer'
import { createFileAuthAdapter } from './file-auth-adapter'
import { authFormatPlugin } from './auth-format-plugin'
import { trustedOrigins } from './trusted-origins'

const fileAuthAdapter = createFileAuthAdapter()

export const auth = betterAuth({
  database: (opts: BetterAuthOptions) => fileAuthAdapter(opts),
  emailAndPassword: { enabled: true },
  plugins: [bearer(), authFormatPlugin()],
  baseURL: process.env.VITE_API_URL ?? process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [...trustedOrigins()],
})
