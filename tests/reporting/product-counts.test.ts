import assert from 'node:assert/strict'
import { test } from 'node:test'
import { metricSchema, snapshotSchema } from '../../lib/reporting/schema'
import { snapshotFromExports } from '../../scripts/reporting/collect'
import { collectDiagramsCounts, parseDiagramsDashboard, withProductCounts } from '../../scripts/reporting/product-counts'
import { snapshotRevision } from '../../scripts/reporting/publish'
import { candidateHolds } from '../../scripts/reporting/validate'

const dashboard = '<main><p>Counts PNG exports only.</p><div>100</div><div>Unique exporters (all-time)</div><div>200</div><div>Total exports (all-time)</div></main>'
const checkedAt = '2026-11-14T00:00:00.000Z'
const nextCheck = '2026-11-15T00:00:00.000Z'
const empty = snapshotFromExports([], [], checkedAt)
const diagrams = { sourceId: 'diagrams' as const, checkedAt, exporterBrowsers: 100, pngExports: 200 }
const shapes = {
  sourceId: 'shapes-records' as const,
  checkedAt,
  completedGames: 210,
  dailyCompletions: { days: [{ date: '2026-11-10', completedGames: 210 }], undated: 0 },
}
const baseline = withProductCounts(empty, empty, [diagrams, shapes])
baseline.sources.find(source => source.id === 'shapes-records')!.status = 'frozen'

test('Diagrams collector accepts the expected dashboard and rejects failures or ambiguous totals', async () => {
  assert.deepEqual(parseDiagramsDashboard(dashboard), { exporterBrowsers: 100, pngExports: 200 })
  assert.throws(() => parseDiagramsDashboard(dashboard.replace('Total exports (all-time)', 'All downloads')))
  assert.throws(() => parseDiagramsDashboard(dashboard.replace('200', '20')))
  assert.throws(() => parseDiagramsDashboard(dashboard.replace('</main>', '<div>300</div><div>Total exports (all-time)</div></main>')))
  await assert.rejects(collectDiagramsCounts(async () => new Response(dashboard, { status: 503 })))
  await assert.rejects(collectDiagramsCounts(async () => new Response('<main>Could not load metrics.</main>', {
    headers: { 'content-type': 'text/html' },
  })))
})

test('unchanged refresh keeps the published revision and the unconfigured classroom total', () => {
  const candidate = withProductCounts({ ...empty, generatedAt: nextCheck }, baseline, [
    { ...diagrams, checkedAt: nextCheck },
  ])
  assert.equal(snapshotRevision(candidate), snapshotRevision(baseline))
  assert.equal(candidate.sources.find(source => source.id === 'shapes-records')?.status, 'frozen')
  assert.equal(candidate.metrics.find(metric => metric.id === 'shapes-games-completed')?.value, 210)
  assert.deepEqual(candidate.metrics.find(metric => metric.id === 'shapes-games-completed')?.dailyCompletions, shapes.dailyCompletions)
  assert.equal(candidate.metrics.some(metric => metric.scope === 'ecosystem'), false)
  const wrongScope = { ...candidate, metrics: candidate.metrics.map(metric => ({ ...metric, scope: 'ecosystem' })) }
  assert.equal(snapshotSchema.safeParse(wrongScope).success, false)
})

test('refresh guards source failure and unusual changes to cumulative product counts', () => {
  const policy = { historyApproved: true, publicationEnabled: true, anomalyPolicyApproved: true }
  const stage = (pngExports: number) => withProductCounts(empty, baseline, [{ ...diagrams, pngExports, checkedAt: nextCheck }])
  assert.deepEqual(candidateHolds(policy, baseline, [], stage(202)), [])
  assert.equal(stage(202).sources[0].checkedAt, nextCheck)
  assert.ok(candidateHolds(policy, baseline, [], stage(199)).includes('cumulative_decrease'))
  assert.ok(candidateHolds(policy, baseline, [], stage(241)).includes('headline_spike'))
  assert.ok(candidateHolds(policy, baseline, ['diagrams'], stage(202)).includes('source_failed'))
  const olderAccepted = stage(198)
  assert.deepEqual(candidateHolds(policy, olderAccepted, [], stage(199)), [])
  assert.ok(candidateHolds(policy, olderAccepted, [], stage(199), baseline).includes('cumulative_decrease'))
})

test('Shapes accepts older snapshots and validates daily count coverage', () => {
  const shapeMetric = baseline.metrics.find(metric => metric.id === 'shapes-games-completed')!
  const { dailyCompletions, ...legacyMetric } = shapeMetric
  const legacy = { ...baseline, metrics: baseline.metrics.map(metric => metric === shapeMetric ? legacyMetric : metric) }
  assert.equal(snapshotSchema.safeParse(legacy).success, true)
  assert.deepEqual(withProductCounts(empty, legacy, []).metrics.find(metric => metric.id === shapeMetric.id), legacyMetric)

  const valid = { days: [{ date: '2026-11-10', completedGames: 209 }], undated: 1 }
  assert.equal(metricSchema.safeParse({ ...shapeMetric, dailyCompletions: valid }).success, true)
  const invalid = [
    { ...valid, undated: 0 },
    { ...valid, days: [{ date: '2026-11-31', completedGames: 209 }] },
    { ...valid, days: [{ date: '2026-11-1', completedGames: 209 }] },
    { ...valid, days: [{ date: '2026-10-31', completedGames: 209 }] },
    { ...valid, days: [{ date: '2026-11-10', completedGames: 100 }, { date: '2026-11-10', completedGames: 109 }] },
    { ...valid, days: [{ date: '2026-11-10', completedGames: 100 }, { date: '2026-11-09', completedGames: 109 }] },
    { ...valid, days: [{ ...valid.days[0], reference: 'private-reference' }] },
  ]
  for (const breakdown of invalid) {
    assert.equal(metricSchema.safeParse({ ...shapeMetric, dailyCompletions: breakdown }).success, false)
  }
  assert.equal(metricSchema.safeParse({ ...shapeMetric, periodId: 'year:2026' }).success, false)
  assert.equal(metricSchema.safeParse({ ...shapeMetric, id: 'diagrams-png-exports' }).success, false)
  assert.equal(metricSchema.safeParse({ ...shapeMetric, dataThrough: null }).success, false)
  const lateDay = { days: [{ date: '2026-11-14', completedGames: 210 }], undated: 0 }
  assert.equal(metricSchema.safeParse({ ...shapeMetric, dataThrough: '2026-11-13T16:00:00Z', dailyCompletions: lateDay }).success, true)
  assert.equal(metricSchema.safeParse({ ...shapeMetric, dataThrough: '2026-11-13T15:59:59Z', dailyCompletions: lateDay }).success, false)

  const checkedAfterExercise = { ...shapeMetric, dataThrough: '2026-11-24T07:05:57.871Z' }
  const exerciseEnd = { days: [{ date: '2026-11-22', completedGames: 210 }], undated: 0 }
  const afterExercise = { days: [{ date: '2026-11-23', completedGames: 210 }], undated: 0 }
  assert.equal(metricSchema.safeParse({ ...checkedAfterExercise, dailyCompletions: exerciseEnd }).success, true)
  assert.equal(metricSchema.safeParse({ ...checkedAfterExercise, dailyCompletions: afterExercise }).success, false)
})

test('Shapes refresh updates the snapshot when the daily counts change and the total stays the same', () => {
  const active = withProductCounts(empty, baseline, [shapes])
  const unchanged = withProductCounts({ ...empty, generatedAt: nextCheck }, active, [{ ...shapes, checkedAt: nextCheck }])
  assert.equal(snapshotRevision(unchanged), snapshotRevision(active))

  const dailyCompletions = { days: [{ date: '2026-11-10', completedGames: 209 }], undated: 1 }
  const next = withProductCounts(empty, active, [{ ...shapes, checkedAt: nextCheck, dailyCompletions }])
  assert.notEqual(snapshotRevision(next), snapshotRevision(active))
  assert.deepEqual(next.metrics.find(metric => metric.id === 'shapes-games-completed')?.dailyCompletions, dailyCompletions)
})
