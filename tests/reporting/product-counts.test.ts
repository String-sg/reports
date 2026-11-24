import assert from 'node:assert/strict'
import { test } from 'node:test'
import { snapshotSchema } from '../../lib/reporting/schema'
import { snapshotFromExports } from '../../scripts/reporting/collect'
import { collectDiagramsCounts, parseDiagramsDashboard, withProductCounts } from '../../scripts/reporting/product-counts'
import { snapshotRevision } from '../../scripts/reporting/publish'
import { candidateHolds } from '../../scripts/reporting/validate'

const dashboard = '<main><p>Counts PNG exports only.</p><div>100</div><div>Unique exporters (all-time)</div><div>200</div><div>Total exports (all-time)</div></main>'
const checkedAt = '2026-10-25T00:00:00.000Z'
const nextCheck = '2026-10-26T00:00:00.000Z'
const empty = snapshotFromExports([], [], checkedAt)
const diagrams = { sourceId: 'diagrams' as const, checkedAt, exporterBrowsers: 100, pngExports: 200 }
const baseline = withProductCounts(empty, empty, [
  diagrams, { sourceId: 'shapes-records', checkedAt, completedGames: 210 },
])
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
