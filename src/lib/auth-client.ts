import { z } from 'zod'
import { createAuthClient } from 'better-auth/react'
import type { ClientFetchOption } from '@better-auth/core'
import type { RequestContext } from '@better-fetch/fetch'
import { createNitroAuthAdapter } from '../../backends/nitro/client-adapter'
import { createJsonServerAuthAdapter } from '../../backends/json-server/client-adapter'
import { createViteAuthAdapter } from '../../backends/vite/client-adapter'
import { createMswAuthAdapter } from '../../backends/msw/client-adapter'
import { getTokenFromSession } from './session-ref'


type AuthAdapter = {
  auth?: ClientFetchOption['auth'];
  request: Record<string, (src: unknown) => void>;
  response: Record<string, (src: unknown) => void>;
}

function ensureContextUrl (ctx: { url: string | URL }): URL {
  const apiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim()
  const base = apiUrl
    || (typeof window !== 'undefined'
      ? window.location.origin
      : 'http://localhost')
  return (ctx.url = z.union([
    z.instanceof(URL),
    z.string()
      .transform((s) => new URL(
        s,
        base,
      )),
  ])
    .parse(ctx.url))
}

/** Универсальные fetchOptions: принимают адаптер, onRequest/onSuccess работают через его request/response. */
function createAdapterFetchOptions (adapter: AuthAdapter): ClientFetchOption {
  return {
    auth: adapter.auth ?? {
      type: 'Bearer' as const,
      token: () => getTokenFromSession() ?? '',
    },
    onRequest (context) {
      ensureContextUrl(context)
      adapter.request[`${(context.method ?? 'GET').toUpperCase()} ${(context as RequestContext & { url: URL }).url.pathname}`]?.({
        context,
        session: globalThis.sessionStorage,
      })
      ensureContextUrl(context)
      return context
    },
    onSuccess (context) {
      ensureContextUrl(context.request)
      const responseKey = (context.data as Record<string, string>)?._route
        ? `${(context.request.method ?? 'GET').toUpperCase()} ${(context.data as Record<string, string>)?._route}`
        : `${(context.request.method ?? 'GET').toUpperCase()} ${(context.request as RequestContext & { url: URL }).url.pathname}`
      adapter.response[responseKey]?.({
        context,
        session: globalThis.sessionStorage,
      })
    },
  }
}

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL,
  fetchOptions: createAdapterFetchOptions((
    {
      nitro: createNitroAuthAdapter(),
      'json-server': createJsonServerAuthAdapter(),
      vite: createViteAuthAdapter(),
      msw: createMswAuthAdapter(),
    } as Record<string, AuthAdapter>
  )[import.meta.env.VITE_AUTH_BACKEND ?? 'nitro'] ?? {
    auth: {
      type: 'Bearer',
      token: () => getTokenFromSession() ?? '',
    },
    request: {},
    response: {},
  }),
})
