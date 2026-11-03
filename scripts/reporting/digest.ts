import { createHash } from 'node:crypto'
function canonical(value: unknown): unknown {
  if(Array.isArray(value)) return value.map(canonical)
  if(value && typeof value === 'object') return Object.fromEntries(Object.entries(value).sort(([a],[b])=>a.localeCompare(b)).map(([key,v])=>[key,canonical(v)]))
  return value
}
export const digest = (value: unknown) => createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex')
