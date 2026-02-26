/**
 * Адаптер Better Auth → бекенд json-server (подсистема auth: json-server-auth).
 * Сессия и контекст приходят извне (auth-client). Маппер мутирует context/session через mapper-proxy.
 */

import { z } from 'zod'
import { jwtDecode } from 'jwt-decode'
import { mapObject } from 'mapstronaut'
import { getTokenFromSession } from '../../src/lib/session-ref'
import type { RequestContext } from '@better-fetch/fetch'
import { mapper as runMapper,
  mapperWithProxy,
  pathHandlers,
  rules,
  type PathSetter } from '../../src/lib/mapper'

function tryOrDefault<T> (fn: () => T, defaultValue: T): T {
  try {
    return fn()
  } catch {
    return defaultValue
  }
}

const toStringOrNull = z.union([
  z.null(),
  z.undefined(),
  z.unknown()
    .transform(String),
]).parse

const runMapperWithSetters = (
  ruleList: Parameters<typeof mapObject>[0],
  pathSetters?: Partial<Record<string, PathSetter>>,
) => (src: Record<string, unknown>) => {
  mapperWithProxy(
    ruleList,
    pathSetters ?? {},
  )(
    src,
    src,
    pathHandlers,
  )
}

export function createJsonServerAuthAdapter () {
  return {
    auth: {
      type: 'Bearer' as const,
      token: () => getTokenFromSession() ?? '',
    },
    request: {
      'GET /api/auth/get-session': runMapper(rules([
        [
          null,
          'context.body.session.accessToken',
          () => getTokenFromSession() ?? null,
        ],
        ['/api/auth/get-session', 'context.body._route'],
        ['data:application/json', 'context.baseURL'],
        [
          'baseURL + body',
          'context.url',
          (_: unknown, _src: unknown, target: { context: { baseURL: string; body: object } }) =>
            `${target.context?.baseURL},${encodeURIComponent(JSON.stringify(target.context.body))}`,
        ],
      ])),
      'POST /api/auth/sign-out': runMapper(rules([
        ['data:application/json', 'context.baseURL'],
        ['/sign-out', 'context.body._route'],
        [true, 'context.body.success'],
        [
          'baseURL + body',
          'context.url',
          (_: unknown, _s: unknown, target: { context: { baseURL?: string; body?: object } }) =>
            `${target.context?.baseURL ?? ''},${encodeURIComponent(JSON.stringify(target.context?.body ?? {}))}`,
        ],
      ])),
      'POST /api/auth/sign-in/email': runMapperWithSetters(rules([
        [import.meta.env.VITE_API_URL, 'context.baseURL'],
        ['/login', 'context.url'],
        ['context.body.email', 'context.body.email'],
        ['context.body.password', 'context.body.password'],
      ])),
      'POST /api/auth/sign-up/email': runMapper(rules([
        [import.meta.env.VITE_API_URL, 'context.baseURL'],
        ['/register', 'context.url'],
        ['context.body.email', 'context.body.email'],
        ['context.body.password', 'context.body.password'],
        ['context.body.name', 'context.body.name'],
      ])),
    },
    response: {
      'POST /login': runMapper(rules([['context.data.user', 'context.data.user'], ['context.data.accessToken', 'context.data.session.accessToken']])),
      'POST /register': runMapper(rules([['context.data.user', 'context.data.user'], ['context.data.accessToken', 'context.data.session.accessToken']])),
      'GET /api/auth/get-session': runMapper(rules([
        [
          'context.request',
          'context.baseURL',
          (request: RequestContext) => new URL(request.url).href.split(',')?.[0] ?? '',
        ],
        [
          'context.request',
          'context.body',
          (request: RequestContext) => tryOrDefault(
            () => JSON.parse(decodeURIComponent(new URL(request.url).href.split(',')?.[1] ?? '')),
            {},
          ),
        ],
        [
          null,
          'context.data.user',
          (_: unknown, _s: unknown, target: { context?: { body?: { session?: { accessToken?: string } } } }) => {
            const body = target.context?.body
            const token = body?.session?.accessToken
            const p = tryOrDefault(
              () => (token
                ? jwtDecode<Record<string, unknown>>(token)
                : null),
              null,
            )
            return p
              ? {
                id: p.sub,
                email: p.email,
                name: p.email,
              }
              : null
          },
        ],
        ['context.data.session', 'context.data.session'],
        [
          'context.body.session.accessToken',
          'context.data.session.accessToken',
          toStringOrNull,
        ],
      ])),
      'POST /sign-out': runMapper(rules([['context.data.success', 'context.data.success']])),
    },
  }
}
