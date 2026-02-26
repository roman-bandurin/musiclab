/**
 * Адаптер Better Auth → MSW (тот же интерфейс: /api/login, /api/register, /api/logout).
 * onRequest/onSuccess — тонкие прослойки: session + context, маппер по роуту.
 */

import { getTokenFromSession } from '../../src/lib/session-ref'
import { mapper, rules } from '../../src/lib/mapper'

export function createMswAuthAdapter () {
  return {
    auth: {
      type: 'Bearer' as const,
      token: () => getTokenFromSession() ?? '',
    },
    request: {
      'GET /api/auth/get-session': mapper(rules([['', 'context.baseURL'], ['/api/auth/get-session', 'context.url']])),
      'POST /api/auth/sign-out': mapper(rules([
        ['', 'context.baseURL'],
        ['/api/auth/sign-out', 'context.body._route'],
        ['/api/logout', 'context.url'],
      ])),
      'POST /api/auth/sign-in/email': mapper(rules([
        ['', 'context.baseURL'],
        ['/api/login', 'context.url'],
        ['context.body.email', 'context.body.email'],
        ['context.body.password', 'context.body.password'],
      ])),
      'POST /api/auth/sign-up/email': mapper(rules([
        ['', 'context.baseURL'],
        ['/api/register', 'context.url'],
        ['context.body.email', 'context.body.email'],
        ['context.body.password', 'context.body.password'],
        ['context.body.name', 'context.body.name'],
      ])),
    },
    response: {
      'POST /api/login': mapper(rules([
        ['context.data.user', 'context.data.user'],
        ['context.data.session', 'context.data.session'],
        ['context.data.token', 'context.data.session.accessToken'],
        ['context.data.token', 'session.accessToken'],
      ])),
      'POST /api/register': mapper(rules([
        ['context.data.user', 'context.data.user'],
        ['context.data.session', 'context.data.session'],
        ['context.data.token', 'context.data.session.accessToken'],
        ['context.data.token', 'session.accessToken'],
      ])),
      'GET /api/auth/get-session': mapper(rules([['context.data.user', 'context.data.user'], ['context.data.session', 'context.data.session']])),
      'POST /api/logout': mapper(rules([['context.data.success', 'context.data.success'], [null, 'session.accessToken']])),
    },
  }
}
