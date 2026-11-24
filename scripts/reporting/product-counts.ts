import pg from 'pg'
import { z } from 'zod'
import {
  isProductCount, productMetricBindings, shapesMonthlyCompletionsSchema, shapesMonthlyTotal, snapshotSchema,
  type ReportSnapshot, type ShapesMonthlyCompletions,
} from '../../lib/reporting/schema'
import { digest } from './digest'

const count = z.number().int().nonnegative()
const diagramsTotals = z.object({ exporterBrowsers: count, pngExports: count }).strict()
  .refine(totals => totals.exporterBrowsers <= totals.pngExports)
const sourceIds = ['diagrams', 'shapes-records'] as const
export type ProductCountSource = typeof sourceIds[number]
type ProductCounts = { checkedAt: string } & (
  | ({ sourceId: 'diagrams' } & z.infer<typeof diagramsTotals>)
  | { sourceId: 'shapes-records'; completedGames: number; monthlyCompletions: ShapesMonthlyCompletions }
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
  WITH dated_sources AS (
    SELECT
      encode(sha256(convert_to('shapes-completion/' || id::text, 'UTF8')), 'hex') AS reference,
      CASE WHEN payload->>'completedAt' ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}T'
        THEN (payload->>'completedAt')::timestamptz END AS completed_at
    FROM shapes_assessments
    WHERE payload IS NOT NULL
      AND payload->>'provenance' = 'assessed'
      AND CASE WHEN jsonb_typeof(payload->'attempts') = 'array'
        THEN jsonb_array_length(payload->'attempts') = 20 ELSE false END
    UNION ALL
    SELECT reference, completed_at FROM shapes_recovered_results
    UNION ALL
    SELECT id, NULL::timestamptz FROM shapes_completion_traces WHERE accepted
  ), candidates AS (
    SELECT reference,
      CASE WHEN isfinite(completed_at)
        THEN to_char(completed_at AT TIME ZONE 'Asia/Singapore', 'YYYY-MM')
      END AS month
    FROM dated_sources
  ), games AS (
    SELECT reference,
      CASE WHEN count(DISTINCT month) = 1 THEN min(month) END AS month,
      count(DISTINCT month) > 1 AS conflicting_month
    FROM candidates
    GROUP BY reference
  ), buckets AS (
    SELECT month, count(*)::int AS completed_games
    FROM games
    WHERE month IS NOT NULL
    GROUP BY month
  )
  SELECT
    transaction_timestamp() AS checked_at,
    count(*)::int AS all_time,
    (count(*) FILTER (WHERE month IS NULL))::int AS undated,
    (count(*) FILTER (WHERE conflicting_month))::int AS conflicting_months,
    coalesce((
      SELECT jsonb_agg(jsonb_build_object(
        'month', month, 'completedGames', completed_games
      ) ORDER BY month)
      FROM buckets
    ), '[]'::jsonb) AS monthly
  FROM games
`

const shapesCountResult = z.object({
  checked_at: z.date(),
  all_time: count,
  undated: count,
  conflicting_months: count,
  monthly: shapesMonthlyCompletionsSchema.shape.months,
}).strict().refine(result => result.conflicting_months <= result.undated)

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
    const [result] = z.tuple([shapesCountResult]).parse(rows)
    const monthlyCompletions = shapesMonthlyCompletionsSchema.parse({ months: result.monthly, undated: result.undated })
    if (shapesMonthlyTotal(monthlyCompletions) !== result.all_time) {
      throw new Error('Shapes monthly counts did not reconcile')
    }
    await client.query('COMMIT')
    return {
      sourceId: 'shapes-records', checkedAt: result.checked_at.toISOString(),
      completedGames: result.all_time, monthlyCompletions,
    }
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
    const monthlyCompletions = read.sourceId === 'shapes-records' ? read.monthlyCompletions : undefined
    const unchanged = priorSource?.status === 'active'
      && totals.every(([id, value]) => priorMetrics.some(metric =>
        metric.id === id && metric.value === value
        && (monthlyCompletions === undefined || digest(metric.monthlyCompletions ?? null) === digest(monthlyCompletions))
      ))
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
        ...(monthlyCompletions && { monthlyCompletions }),
      })
    }
  }
  return snapshotSchema.parse({ ...snapshot, sources, metrics })
}
