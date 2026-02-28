/**
 * Global declarations for Nitro auto-imports (defineEventHandler, defineNitroPlugin, etc.)
 * so server files don't need explicit imports and TypeScript/IDE recognize them.
 */
declare global {
  type H3Event = Parameters<typeof import('h3').getRequestHeader>[0]
  const defineEventHandler: typeof import('h3').defineEventHandler
  const defineNitroPlugin: typeof import('nitropack/runtime').defineNitroPlugin
  const createError: typeof import('h3').createError
  const getRequestURL: typeof import('h3').getRequestURL
  const getMethod: typeof import('h3').getMethod
  const getRequestHeaders: typeof import('h3').getRequestHeaders
  const readRawBody: typeof import('h3').readRawBody
  const setResponseStatus: typeof import('h3').setResponseStatus
  const getRequestHeader: typeof import('h3').getRequestHeader
  const setResponseHeader: typeof import('h3').setResponseHeader
  const sendRedirect: typeof import('h3').sendRedirect
  const getQuery: typeof import('h3').getQuery
  const readBody: typeof import('h3').readBody
  const getRouterParam: typeof import('h3').getRouterParam
  const fromNodeMiddleware: typeof import('h3').fromNodeMiddleware
  const useRuntimeConfig: typeof import('nitropack/runtime').useRuntimeConfig
  const useStorage: typeof import('nitropack/runtime').useStorage
  const useEvent: typeof import('nitropack/runtime').useEvent
}

export {}
