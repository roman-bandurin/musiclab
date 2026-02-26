/**
 * Маппер с прокси как подсистемами: накопление пути, постфикс .value для mapstronaut.
 * По путям — геттер/сеттер (pathHandlers) или фолбек на getByPath/setByPath.
 */

import { mapObject, type Rule, type Structure } from 'mapstronaut'

type Accessor = { get: () => unknown; set: (value: unknown) => void }

/** pathSetters: по точному пути, передаётся path. */
export type PathSetter = (value: unknown, path: string, backing: Record<string, unknown>) => void
/** pathHandlers: suffix = путь под ключом хендлера (например session.token → suffix "token"). */
export type PathHandlerGetter = (suffix: string, backing: Record<string, unknown>) => unknown
export type PathHandlerSetter = (value: unknown, suffix: string, backing: Record<string, unknown>) => void

export type PathHandler = {
  get?: PathHandlerGetter;
  set?: PathHandlerSetter;
}

/** Словарь по пути: геттер и/или сеттер; при совпадении пути (или префикса) применяются, иначе фолбек. */
export type PathHandlers = Partial<Record<string, PathHandler>>

export type PathProxyOptions = {
  pathSetters?: Partial<Record<string, PathSetter>>;
  pathHandlers?: PathHandlers;
}

const PATH_VALUE_KEY = 'value'
const valuePostfix = '.' + PATH_VALUE_KEY

/** Словарь обработчиков по путям (session через getItem/setItem, заголовки ответа — только чтение). */
export const pathHandlers: PathHandlers = {
  session: {
    get (suffix, _backing) {
      if (suffix === '') return undefined
      const storage = globalThis.sessionStorage
      const v = storage.getItem(suffix)
      if (v == null) return undefined
      try {
        return JSON.parse(v)
      } catch {
        return v
      }
    },
    set (value, suffix, _backing) {
      const storage = globalThis.sessionStorage
      if (suffix === '') {
        if (value !== undefined && value !== null && typeof value === 'object' && !Array.isArray(value)) {
          for (const [k, v] of Object.entries(value)) {
            if (v === undefined || v === null) storage.removeItem(k)
            else storage.setItem(
              k,
              typeof v === 'string'
                ? v
                : JSON.stringify(v),
            )
          }
        }
        return
      }
      if (typeof value === 'object' && value !== null && !Array.isArray(value) && Object.keys(value).length === 0) return
      const storageKey = suffix.endsWith(`.${PATH_VALUE_KEY}`)
        ? suffix.slice(
          0,
          -(PATH_VALUE_KEY.length + 1),
        )
        : suffix
      if (value === undefined || value === null) {
        storage.removeItem(storageKey)
        return
      }
      storage.setItem(
        storageKey,
        typeof value === 'string'
          ? value
          : JSON.stringify(value),
      )
    },
  },
  'context.response.headers': {
    get (suffix, backing) {
      if (suffix === '') return undefined
      const headerName = suffix.endsWith(`.${PATH_VALUE_KEY}`)
        ? suffix.slice(
          0,
          -(PATH_VALUE_KEY.length + 1),
        )
        : suffix
      const ctx = backing.context as { response?: { headers?: { get (name: string): string | null } } }
      return ctx?.response?.headers?.get?.(
        headerName,
      ) ?? undefined
    },
    set () {},
  },
}

function getHandlerKey (path: string, pathHandlers: PathHandlers): string | undefined {
  const keys = Object.keys(pathHandlers)
    .filter(
      (k) => path === k || path.startsWith(k + '.'),
    )
  if (keys.length === 0) return undefined
  keys.sort((a, b) => b.length - a.length)
  return keys[0]
}

/** Есть ли у пути segment как «собственное» свойство — для getOwnPropertyDescriptor, чтобы JSONPath (Object.hasOwn) видел виртуальные поля прокси. */
function pathHasOwnProperty (
  backing: Record<string, unknown>,
  path: string,
  segment: string,
  pathHandlers?: PathHandlers,
): boolean {
  if (segment === PATH_VALUE_KEY) {
    return getByPath(
      backing,
      path,
    ) !== undefined
      || (pathHandlers !== undefined && getHandlerKey(
        path,
        pathHandlers,
      ) !== undefined)
  }
  const nextPath = path
    ? `${path}.${segment}`
    : segment
  if (pathHandlers) {
    for (const k of Object.keys(pathHandlers)) {
      if (k === nextPath || k.startsWith(nextPath + '.')) return true
    }
  }
  const parent = path
    ? getByPath(
      backing,
      path,
    )
    : backing
  if (parent == null || typeof parent !== 'object') return false
  return Object.prototype.hasOwnProperty.call(
    parent as object,
    segment,
  )
}

export function getByPath (obj: Record<string, unknown>, path: string): unknown {
  if (!path) return obj
  const parts = path.split('.')
  let cur: unknown = obj
  for (const p of parts) {
    if (cur == null || typeof cur !== 'object') return undefined
    cur = (cur as Record<string, unknown>)[p]
  }
  return cur
}

export function setByPath (obj: Record<string, unknown>, path: string, value: unknown): void {
  if (!path) return
  const parts = path.split('.')
  let cur: Record<string, unknown> = obj
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i]!
    if (cur[p] == null || typeof cur[p] !== 'object') (cur as Record<string, unknown>)[p] = {}
    cur = cur[p] as Record<string, unknown>
  }
  (cur as Record<string, unknown>)[parts[parts.length - 1]!] = value
}

function buildAccessor (
  backing: Record<string, unknown>,
  nextPath: string,
  options: PathProxyOptions,
): Accessor {
  const {
    pathSetters,
    pathHandlers,
  } = options
  const handlerKey = pathHandlers
    ? getHandlerKey(
      nextPath,
      pathHandlers,
    )
    : undefined
  const handler = handlerKey
    ? pathHandlers?.[handlerKey]
    : undefined
  if (handler?.get && handlerKey !== undefined) {
    const suffix = nextPath === handlerKey
      ? ''
      : nextPath.slice(handlerKey.length + 1)
    return {
      get: () => handler.get!(
        suffix,
        backing,
      ),
      set: (v) => handler.set?.(
        v,
        suffix,
        backing,
      ),
    }
  }
  return {
    get: () => getByPath(
      backing,
      nextPath,
    ),
    set: (v) => {
      const setter = pathSetters?.[nextPath]
      if (setter) setter(
        v,
        nextPath,
        backing,
      )
      else setByPath(
        backing,
        nextPath,
        v,
      )
    },
  }
}

export function createPathProxy (
  backing: Record<string, unknown>,
  path: string,
  options: PathProxyOptions | undefined,
  accessor: Accessor,
): Record<string, unknown> {
  const opts = options ?? {}
  return new Proxy(
    {} as Record<string, unknown>,
    {
      getOwnPropertyDescriptor (_, prop: string) {
        if (!pathHasOwnProperty(
          backing,
          path,
          prop,
          opts.pathHandlers,
        )) return undefined
        return {
          configurable: true, enumerable: true, value: undefined,
        }
      },
      get (_, prop: string) {
        if (prop === PATH_VALUE_KEY) return accessor.get()
        const nextPath = path
          ? `${path}.${prop}`
          : prop
        const childAccessor = buildAccessor(
          backing,
          nextPath,
          opts,
        )
        return createPathProxy(
          backing,
          nextPath,
          opts,
          childAccessor,
        )
      },
      set (_, prop: string, value: unknown) {
        if (prop === PATH_VALUE_KEY) {
          accessor.set(value)
          return true
        }
        const nextPath = path
          ? `${path}.${prop}`
          : prop
        const opts = options ?? {}
        const handlerKey = opts.pathHandlers
          ? getHandlerKey(
            nextPath,
            opts.pathHandlers,
          )
          : undefined
        const handler = handlerKey
          ? opts.pathHandlers?.[handlerKey]
          : undefined
        if (handler?.set) {
          const childAccessor = buildAccessor(
            backing,
            nextPath,
            opts,
          )
          childAccessor.set(value)
          return true
        }
        setByPath(
          backing,
          nextPath,
          value,
        )
        return true
      },
    },
  )
}

function getRuleTarget (r: Rule): string {
  return Array.isArray(r)
    ? r[1]
    : r.target
}

export function rulesWithValuePostfix (ruleList: Structure): Structure {
  return ruleList.map((r) => {
    if (!r || typeof r !== 'object') return r
    const targetStr = String(getRuleTarget(r)) + valuePostfix
    const first = Array.isArray(r)
      ? r[0]
      : (r as { source?: string }).source
    const sourceStr = typeof first === 'string' && first.length > 0
      ? first + valuePostfix
      : first
    const rule = Array.isArray(r)
      ? [sourceStr, targetStr] as Rule
      : {
        ...r,
        target: targetStr,
        ...(typeof first === 'string'
          ? { source: sourceStr }
          : {}),
      }
    return rule
  })
}

/**
 * Маппер с прокси: при targetBacking мутирует его, иначе создаёт новый underlying и возвращает.
 * pathHandlers — словарь путь → { get?, set? }; по совпадению пути применяются, иначе фолбек.
 */
export function mapperWithProxy (
  ruleList: Parameters<typeof mapObject>[0],
  pathSetters: Partial<Record<string, PathSetter>> = {},
) {
  return (
    src: Record<string, unknown>,
    targetBacking?: Record<string, unknown>,
    pathHandlers?: PathHandlers,
  ) => {
    const backing = targetBacking ?? {}
    const options: PathProxyOptions = {
      pathSetters, pathHandlers,
    }
    const structureWithValue = rulesWithValuePostfix(
      Array.isArray(ruleList)
        ? ruleList
        : (ruleList as Structure),
    )
    const rootAccessor = (b: Record<string, unknown>): Accessor => ({
      get: () => b,
      set: () => {},
    })
    const sourceProxy = createPathProxy(
      src,
      '',
      pathHandlers
        ? { pathHandlers }
        : undefined,
      rootAccessor(src),
    )
    const targetProxy = createPathProxy(
      backing,
      '',
      options,
      rootAccessor(backing),
    )
    mapObject(
      structureWithValue,
      sourceProxy,
      targetProxy,
      { automap: false },
    )
    if (targetBacking !== undefined) return
    return backing
  }
}

/**
 * Маппер без кастомных сеттеров: мутирует src напрямую; pathHandlers задаёт геттеры/сеттеры по путям.
 */
export function mapperMutateInPlace (ruleList: Parameters<typeof mapObject>[0]) {
  return (src: Record<string, unknown>, pathHandlers?: PathHandlers) => {
    mapperWithProxy(ruleList)(
      src,
      src,
      pathHandlers,
    )
  }
}

/** [first, target, transform?, filter?] → Rule; для единого формата правил во всех адаптерах. */
function toRule (arr: unknown[]): Rule | null {
  const [
    first,
    target,
    transform,
    filter,
  ] = arr
  if (target === undefined) return null
  const rule: Rule = { target: String(target) }
  if (typeof first === 'string') {
    if (first.includes('.')) {
      (rule as { source?: string }).source = first
    } else {
      (rule as { constant?: unknown }).constant = first
    }
  } else if (Array.isArray(first) && first.length === 1) {
    (rule as { constant?: unknown }).constant = first[0]
  } else {
    (rule as { constant?: unknown }).constant = first
  }
  if (transform != null) (rule as { transform?: unknown }).transform = transform
  if (filter != null) (rule as { filter?: unknown }).filter = filter
  return rule
}

export function rules (arrays: unknown[][]): Structure {
  return arrays.map(toRule)
    .filter((r): r is Rule => r != null)
}

/** ruleList → (src) => mapperMutateInPlace(ruleList)(src, pathHandlers). */
export function mapper (ruleList: Parameters<typeof mapperMutateInPlace>[0]) {
  return (src: Record<string, unknown>) => {
    mapperMutateInPlace(ruleList)(
      src,
      pathHandlers,
    )
  }
}
