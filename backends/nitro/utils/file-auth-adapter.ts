/**
 * File-based adapter для Better Auth. Хранит user, account, session, verification
 * в backends/nitro/auth-db.json.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { createAdapterFactory } from '@better-auth/core/db/adapter'

const DEFAULT_DB: Record<string, unknown[]> = {
  user: [],
  account: [],
  session: [],
  verification: [],
}

const DATE_KEYS = [
  'createdAt',
  'updatedAt',
  'expiresAt',
  'emailVerified',
]

function reviveDates (obj: unknown): unknown {
  if (obj === null || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(reviveDates)

  const record = obj as Record<string, unknown>
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(record)) {
    if (DATE_KEYS.includes(k) && typeof v === 'string') {
      out[k] = new Date(v)
    } else if (typeof v === 'object' && v !== null) {
      out[k] = reviveDates(v)
    } else {
      out[k] = v
    }
  }
  return out
}

type WhereClause = { field: string; value: unknown; operator?: string; connector?: string }

type AdapterConfig = Parameters<typeof createAdapterFactory>[0]
type AdapterReturn = AdapterConfig extends { adapter: (...args: unknown[]) => infer R } ? R : never

export function createFileAuthAdapter (filePath?: string) {
  const filePathResolved = filePath ?? join(
    process.cwd(),
    'backends',
    'nitro',
    'auth-db.json',
  )
  let db: Record<string, unknown[]>
  let loaded = false

  async function load (): Promise<Record<string, unknown[]>> {
    if (loaded) return db
    try {
      const raw = await readFile(
        filePathResolved,
        'utf-8',
      )
      const parsed = JSON.parse(raw) as Record<string, unknown[]>
      db = {
        user: (parsed.user ?? []).map(reviveDates) as unknown[],
        account: (parsed.account ?? []).map(reviveDates) as unknown[],
        session: (parsed.session ?? []).map(reviveDates) as unknown[],
        verification: (parsed.verification ?? []).map(reviveDates) as unknown[],
      }
    } catch {
      db = { ...DEFAULT_DB }
    }
    loaded = true
    return db
  }

  async function save () {
    await mkdir(
      dirname(filePathResolved),
      { recursive: true },
    )
    await writeFile(
      filePathResolved,
      JSON.stringify(
        db,
        null,
        2,
      ),
      'utf-8',
    )
  }

  const adapterCreator = createAdapterFactory({
    config: {
      adapterId: 'file',
      adapterName: 'File Auth Adapter',
      usePlural: false,
      supportsArrays: true,
      customTransformInput (props) {
        const {
          options, field, action, model,
        } = props
        if (
          (options.advanced?.database?.useNumberId
            || options.advanced?.database?.generateId === 'serial')
          && field === 'id'
          && action === 'create'
        ) {
          const table = db[model]
          return (table?.length ?? 0) + 1
        }
        return props.data
      },
      transaction: async (cb) => {
        const clone = structuredClone(db)
        try {
          return await cb(adapterCreator(lazyOptions!))
        } catch (error) {
          Object.keys(db)
            .forEach((key) => {
              db[key] = clone[key]
            })
          throw error
        }
      },
    },
    adapter: ({
      getFieldName, getModelName,
    }) => {
      const evalClause = (record: Record<string, unknown>, clause: WhereClause) => {
        const {
          field, value, operator,
        } = clause
        switch (operator) {
          case 'in':
            return Array.isArray(value) && value.includes(record[field])
          case 'not_in':
            return Array.isArray(value) && !value.includes(record[field])
          case 'contains':
            return String(record[field] ?? '')
              .includes(String(value))
          case 'starts_with':
            return String(record[field] ?? '')
              .startsWith(String(value))
          case 'ends_with':
            return String(record[field] ?? '')
              .endsWith(String(value))
          case 'ne':
            return record[field] !== value
          case 'gt':
            return value != null && (record[field] as number) > (value as number)
          case 'gte':
            return value != null && (record[field] as number) >= (value as number)
          case 'lt':
            return value != null && (record[field] as number) < (value as number)
          case 'lte':
            return value != null && (record[field] as number) <= (value as number)
          default:
            return record[field] === value
        }
      }

      function executeWhere (where: WhereClause[], model: string) {
        const table = db[model] as Record<string, unknown>[]
        if (!table) return []
        if (!where?.length) return table
        return table.filter((record) => {
          let result = evalClause(
            record,
            where[0],
          )
          for (const clause of where) {
            const clauseResult = evalClause(
              record,
              clause,
            )
            result = clause.connector === 'OR'
              ? result || clauseResult
              : result && clauseResult
          }
          return result
        })
      }

      function convertWhereClause (
        where: WhereClause[],
        model: string,
        join?: Record<string, { relation: string; on: { from: string; to: string }; limit?: number }>,
      ) {
        if (!join) return executeWhere(
          where ?? [],
          model,
        )
        const baseRecords = executeWhere(
          where ?? [],
          model,
        )
        const grouped = new Map<string, Record<string, unknown>>()
        const seenIds = new Map<string, Set<unknown>>()
        for (const baseRecord of baseRecords) {
          const baseId = String(baseRecord.id)
          if (!grouped.has(baseId)) {
            const nested: Record<string, unknown> = { ...baseRecord }
            for (const [joinModel, joinAttr] of Object.entries(join)) {
              const joinModelName = getModelName(joinModel)
              if (joinAttr.relation === 'one-to-one') nested[joinModelName] = null
              else {
                nested[joinModelName] = []
                seenIds.set(
                  `${baseId}-${joinModel}`,
                  new Set(),
                )
              }
            }
            grouped.set(
              baseId,
              nested,
            )
          }
          const nestedEntry = grouped.get(baseId)!
          for (const [joinModel, joinAttr] of Object.entries(join)) {
            const joinModelName = getModelName(joinModel)
            const joinTable = db[joinModelName] as Record<string, unknown>[]
            if (!joinTable) continue
            const matchingRecords = joinTable.filter(
              (jr) => jr[joinAttr.on.to] === baseRecord[joinAttr.on.from],
            )
            if (joinAttr.relation === 'one-to-one') {
              nestedEntry[joinModelName] = matchingRecords[0] ?? null
            } else {
              const seenSet = seenIds.get(`${baseId}-${joinModel}`)!
              const limit = joinAttr.limit ?? 100
              let count = 0
              for (const mr of matchingRecords) {
                if (count >= limit) break
                if (!seenSet.has(mr.id)) {
                  (nestedEntry as Record<string, unknown[]>)[joinModelName].push(mr)
                  seenSet.add(mr.id)
                  count++
                }
              }
            }
          }
        }
        return Array.from(grouped.values())
      }

      const applySort = (records: Record<string, unknown>[], sortBy: { field: string; direction: string } | null, model: string) => {
        if (!sortBy) return records
        const field = getFieldName({
          model, field: sortBy.field,
        })
        return [...records].sort((a, b) => {
          const aVal = a[field]
          const bVal = b[field]
          if (aVal == null && bVal == null) return 0
          if (aVal == null) return -1
          if (bVal == null) return 1
          if (typeof aVal === 'string' && typeof bVal === 'string') {
            return sortBy.direction === 'asc'
              ? aVal.localeCompare(bVal)
              : bVal.localeCompare(aVal)
          }
          if (aVal instanceof Date && bVal instanceof Date) {
            return sortBy.direction === 'asc'
              ? aVal.getTime() - bVal.getTime()
              : bVal.getTime() - aVal.getTime()
          }
          const cmp = (aVal as number) - (bVal as number)
          return sortBy.direction === 'asc'
            ? cmp
            : -cmp
        })
      }

      return {
        create: async ({
          model, data,
        }: { model: string; data: Record<string, unknown> }) => {
          const table = db[model]
          if (!table) db[model] = [];
          (db[model] as unknown[]).push(data)
          await save()
          return data
        },
        findOne: async ({
          model, where, join,
        }: { model: string; where: WhereClause[]; join?: unknown }) => {
          const joinTyped = join as Record<string, { relation: string; on: { from: string; to: string }; limit?: number }> | undefined
          const res = convertWhereClause(
            where ?? [],
            model,
            joinTyped,
          )
          if (Array.isArray(res) && !res.length) return null
          return ((Array.isArray(res)
            ? res[0]
            : res) ?? null) as Record<string, unknown> | null
        },
        findMany: async ({
          model, where, sortBy, limit, offset, join,
        }: {
          model: string;
          where?: WhereClause[];
          sortBy?: { field: string; direction: string } | null;
          limit?: number;
          offset?: number;
          join?: unknown;
        }) => {
          const joinTyped = join as Record<string, { relation: string; on: { from: string; to: string }; limit?: number }> | undefined
          let res = convertWhereClause(
            where ?? [],
            model,
            joinTyped,
          ) as Record<string, unknown>[]
          res = applySort(
            res,
            sortBy ?? null,
            model,
          )
          if (offset != null) res = res.slice(offset)
          if (limit != null) res = res.slice(
            0,
            limit,
          )
          return res as Record<string, unknown>[]
        },
        count: async ({
          model, where,
        }: { model: string; where?: WhereClause[] }) => {
          if (where) return convertWhereClause(
            where,
            model,
          ).length
          return (db[model] ?? []).length
        },
        update: async ({
          model, where, update,
        }: { model: string; where: WhereClause[]; update: Record<string, unknown> }) => {
          const res = convertWhereClause(
            where,
            model,
          )
          res.forEach((r) => Object.assign(
            r,
            update,
          ))
          await save()
          return (res[0] ?? null) as Record<string, unknown> | null
        },
        delete: async ({
          model, where,
        }: { model: string; where: WhereClause[] }) => {
          const table = db[model] as Record<string, unknown>[]
          const res = convertWhereClause(
            where,
            model,
          )
          const set = new Set(res)
          db[model] = table.filter((r) => !set.has(r))
          await save()
        },
        deleteMany: async ({
          model, where,
        }: { model: string; where: WhereClause[] }) => {
          const table = db[model] as Record<string, unknown>[]
          const res = convertWhereClause(
            where,
            model,
          )
          const set = new Set(res)
          let count = 0
          db[model] = table.filter((r) => {
            if (set.has(r)) {
              count++
              return false
            }
            return true
          })
          await save()
          return count
        },
        updateMany: async ({
          model, where, update,
        }: { model: string; where: WhereClause[]; update: Record<string, unknown> }) => {
          const res = convertWhereClause(
            where,
            model,
          )
          res.forEach((r) => Object.assign(
            r,
            update,
          ))
          await save()
          return (res[0] ?? null) as Record<string, unknown> | null
        },
      } as AdapterReturn
    },
  })

  let lazyOptions: Parameters<ReturnType<typeof createAdapterFactory>>[0] | null = null

  return async (options: Parameters<ReturnType<typeof createAdapterFactory>>[0]) => {
    await load()
    lazyOptions = options
    return adapterCreator(options)
  }
}
