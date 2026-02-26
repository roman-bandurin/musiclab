/** TRUSTED_ORIGIN_0, TRUSTED_ORIGIN_1, … до первой пустой/отсутствующей. */
export function * trustedOrigins (): Generator<string> {
  for (let i = 0; ; i++) {
    const v = process.env[`TRUSTED_ORIGIN_${i}`]
    if (v == null || v === '') return
    yield v
  }
}
