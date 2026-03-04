/**
 * Адаптер Better Auth → MSW (тот же интерфейс: /api/login, /api/register, /api/logout).
 * onRequest/onSuccess — тонкие прослойки: session + context, маппер по роуту.
 * baseURL и ключи путей учитывают BASE_URL для GitHub Pages (/musiclab/).
 */

import { getTokenFromSession } from '../../src/lib/session-ref'
import { mapper, rules } from '../../src/lib/mapper'

const basePath = (import.meta.env.BASE_URL || '/').replace(
  /\/?$/,
  '',
)
const baseUrl = typeof window !== 'undefined'
  ? window.location.origin + (import.meta.env.BASE_URL || '/').replace(
    /\/?$/,
    '/',
  )
  : ''
const pathKey = (methodAndPath: string) => {
  const [method, ...rest] = methodAndPath.split(' ')
  const path = rest.join(' ')
  return `${method} ${basePath}${path.startsWith('/')
    ? path
    : '/' + path}`
}

export function createMswAuthAdapter () {
  return {
    auth: {
      type: 'Bearer' as const,
      token: () => getTokenFromSession() ?? '',
    },
    request: {
      [pathKey('GET /api/auth/get-session')]: mapper(rules([[baseUrl, 'context.baseURL'], ['api/auth/get-session', 'context.url']])),
      [pathKey('GET /get-session')]: mapper(rules([[baseUrl, 'context.baseURL'], ['api/auth/get-session', 'context.url']])),
      [pathKey('POST /api/auth/sign-out')]: mapper(rules([
        [baseUrl, 'context.baseURL'],
        ['api/auth/sign-out', 'context.body._route'],
        ['api/logout', 'context.url'],
      ])),
      [pathKey('POST /sign-out')]: mapper(rules([
        [baseUrl, 'context.baseURL'],
        ['api/auth/sign-out', 'context.body._route'],
        ['api/logout', 'context.url'],
      ])),
      [pathKey('POST /api/auth/sign-in/email')]: mapper(rules([
        [baseUrl, 'context.baseURL'],
        ['api/login', 'context.url'],
        ['context.body.email', 'context.body.email'],
        ['context.body.password', 'context.body.password'],
      ])),
      [pathKey('POST /sign-in/email')]: mapper(rules([
        [baseUrl, 'context.baseURL'],
        ['api/login', 'context.url'],
        ['context.body.email', 'context.body.email'],
        ['context.body.password', 'context.body.password'],
      ])),
      [pathKey('POST /api/auth/sign-up/email')]: mapper(rules([
        [baseUrl, 'context.baseURL'],
        ['api/register', 'context.url'],
        ['context.body.email', 'context.body.email'],
        ['context.body.password', 'context.body.password'],
        ['context.body.name', 'context.body.name'],
      ])),
      [pathKey('POST /sign-up/email')]: mapper(rules([
        [baseUrl, 'context.baseURL'],
        ['api/register', 'context.url'],
        ['context.body.email', 'context.body.email'],
        ['context.body.password', 'context.body.password'],
        ['context.body.name', 'context.body.name'],
      ])),
    },
    response: {
      [pathKey('POST /api/login')]: mapper(rules([
        ['context.data.user', 'context.data.user'],
        ['context.data.session', 'context.data.session'],
        ['context.data.token', 'context.data.session.accessToken'],
        ['context.data.token', 'session.accessToken'],
      ])),
      [pathKey('POST /api/register')]: mapper(rules([
        ['context.data.user', 'context.data.user'],
        ['context.data.session', 'context.data.session'],
        ['context.data.token', 'context.data.session.accessToken'],
        ['context.data.token', 'session.accessToken'],
      ])),
      [pathKey('GET /api/auth/get-session')]: mapper(rules([['context.data.user', 'context.data.user'], ['context.data.session', 'context.data.session']])),
      [pathKey('POST /api/logout')]: mapper(rules([['context.data.success', 'context.data.success'], [null, 'session.accessToken']])),
    },
  }
}
