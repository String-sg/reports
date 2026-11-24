import pg from 'pg'
import { z } from 'zod'
import { isProductCount, productMetricBindings, snapshotSchema, type ReportSnapshot } from '../../lib/reporting/schema'

const count = z.number().int().nonnegative()
const diagramsTotals = z.object({ exporterBrowsers: count, pngExports: count }).strict()
  .refine(totals => totals.exporterBrowsers <= totals.pngExports)
const sourceIds = ['diagrams', 'shapes-records'] as const
export type ProductCountSource = typeof sourceIds[number]
type ProductCounts = { checkedAt: string } & (
  | ({ sourceId: 'diagrams' } & z.infer<typeof diagramsTotals>)
  | { sourceId: 'shapes-records'; completedGames: number }
)

export function isProductCountSource(id: string): id is ProductCountSource {
  return sourceIds.some(sourceId => sourceId === id)
}

export function parseDiagramsDashboard(html: string) {
  const main = html.match(/<main\b[^>]*>[\s\S]*?<\/main>/g)
  if (html.length > 256_000 || main?.length !== 1 || !main[0].includes('Counts PNG exports only.')) {
    throw new Error('Diagrams dashboard changed or unavailable')
  }
  // The dashboard renders the integers and these labels together in server HTML.
  const pairs = [...main[0].matchAll(/<div\b[^>]*>\s*(\d+)\s*<\/div>\s*<div\b[^>]*>\s*(Unique exporters \(all-time\)|Total exports \(all-time\))\s*<\/div>/g)]
  const totals = new Map(pairs.map(([, value, label]) => [label, Number(value)]))
  if (pairs.length !== 2 || totals.size !== 2) throw new Error('Diagrams aggregate labels changed')
  return diagramsTotals.parse({
    exporterBrowsers: totals.get('Unique exporters (all-time)'),
    pngExports: totals.get('Total exports (all-time)'),
  })
}

export async function collectDiagramsCounts(fetcher = fetch): Promise<ProductCounts> {
  const response = await fetcher('https://diagrams.string.sg/metrics', {
    cache: 'no-store',
    redirect: 'error',
    signal: AbortSignal.timeout(10_000),
  })
  if (!response.ok || !response.headers.get('content-type')?.startsWith('text/html')) {
    throw new Error('Diagrams dashboard unavailable')
  }
  const totals = parseDiagramsDashboard(await response.text())
  return { sourceId: 'diagrams', checkedAt: new Date().toISOString(), ...totals }
}

const shapesCountSql = `
  WITH completed_refs AS (
    SELECT encode(sha256(convert_to('shapes-completion/' || id::text, 'UTF8')), 'hex') AS reference
    FROM shapes_assessments
    WHERE payload IS NOT NULL
      AND payload->>'provenance' = 'assessed'
      AND CASE WHEN jsonb_typeof(payload->'attempts') = 'array'
        THEN jsonb_array_length(payload->'attempts') = 20 ELSE false END
    UNION
    SELECT reference FROM shapes_recovered_results
    UNION
    SELECT id AS reference FROM shapes_completion_traces WHERE accepted
  )
  SELECT count(*)::int AS completed_games, transaction_timestamp() AS checked_at
  FROM completed_refs
`

async function collectShapesCounts(): Promise<ProductCounts> {
  const connectionString = process.env.REPORTS_SHAPES_RECORDS_DATABASE_URL
  if (!connectionString || !['postgres:', 'postgresql:'].includes(new URL(connectionString).protocol)) {
    throw new Error('Read-only Shapes records access missing')
  }
  const client = new pg.Client({ connectionString, connectionTimeoutMillis: 10_000, query_timeout: 10_000 })
  await client.connect()
  try {
    await client.query('BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY')
    await client.query("SET LOCAL statement_timeout = '5s'")
    const { rows } = await client.query(shapesCountSql)
    const [result] = z.array(z.object({ completed_games: count, checked_at: z.date() }).strict()).length(1).parse(rows)
    await client.query('COMMIT')
    return { sourceId: 'shapes-records', checkedAt: result.checked_at.toISOString(), completedGames: result.completed_games }
  } finally {
    await client.end()
  }
}

export function collectProductCounts(id: ProductCountSource) {
  return id === 'diagrams' ? collectDiagramsCounts() : collectShapesCounts()
}

export function withProductCounts(snapshot: ReportSnapshot, baseline: ReportSnapshot, reads: ProductCounts[]) {
  const sources = [...snapshot.sources]
  const metrics = [...snapshot.metrics]
  for (const sourceId of sourceIds) {
    const read = reads.find(result => result.sourceId === sourceId)
    const priorSource = baseline.sources.find(source => source.id === sourceId)
    const priorMetrics = baseline.metrics.filter(metric => isProductCount(metric.id) && metric.sourceIds.includes(sourceId))
    if (!read) {
      if (priorSource) sources.push(priorSource)
      metrics.push(...priorMetrics)
      continue
    }
    const totals = read.sourceId === 'diagrams'
      ? [['diagrams-exporter-browsers', read.exporterBrowsers], ['diagrams-png-exports', read.pngExports]] as const
      : [['shapes-games-completed', read.completedGames]] as const
    const unchanged = priorSource?.status === 'active'
      && totals.every(([id, value]) => priorMetrics.some(metric => metric.id === id && metric.value === value))
    if (unchanged) {
      sources.push(priorSource)
      metrics.push(...priorMetrics)
      continue
    }
    sources.push({ id: sourceId, checkedAt: read.checkedAt, dataThrough: read.checkedAt, status: 'active' })
    for (const [id, value] of totals) {
      metrics.push({
        id, value, scope: productMetricBindings[id].scope, periodId: 'all',
        coverage: 'complete', sourceIds: [sourceId], dataThrough: read.checkedAt,
      })
    }
  }
  return snapshotSchema.parse({ ...snapshot, sources, metrics })
}
