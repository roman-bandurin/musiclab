import { auth } from './auth'

export async function requireAuth (event: H3Event) {
  const session = await auth.api.getSession({ headers: event.headers })
  if (!session) {
    const origin = getRequestHeader(
      event,
      'origin',
    )
    setResponseHeader(
      event,
      'Access-Control-Allow-Origin',
      origin ?? '*',
    )
    setResponseHeader(
      event,
      'Access-Control-Allow-Credentials',
      'true',
    )
    setResponseHeader(
      event,
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    )
    setResponseHeader(
      event,
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization',
    )
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }
  event.context.auth = session
}
