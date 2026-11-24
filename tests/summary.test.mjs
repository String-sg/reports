import { test } from 'node:test'
import assert from 'node:assert/strict'
import { validShapesSummary } from '../lib/shapes-summary.ts'
const valid = {
  version: 1, periodDays: 30, generatedAt: '2026-10-27T00:00:00.000Z',
  visits: 1, gamesStarted: 0, gamesCompleted: 0,
  reportingTimezone: 'Asia/Singapore', firstEventAt: '2026-09-01T00:00:00.000Z',
  allTime: { visits: 3, gamesStarted: 0, gamesCompleted: 0 },
  monthly: [{ month: '2026-09', visits: 2, gamesStarted: 0, gamesCompleted: 0 }, { month: '2026-10', visits: 1, gamesStarted: 0, gamesCompleted: 0 }],
}
test('accepts expanded summary and an empty history', () => {
  assert.equal(validShapesSummary(valid), true)
  assert.equal(validShapesSummary({ ...valid, visits: 0, allTime: { visits: 0, gamesStarted: 0, gamesCompleted: 0 }, firstEventAt: null, monthly: [] }), true)
})
test('rejects inconsistent totals, invalid months, missing series and unordered data', () => {
  for (const value of [null, { ...valid, allTime: { ...valid.allTime, visits: 99 } },
    { ...valid, monthly: [{ ...valid.monthly[0], month: '2026-13' }] },
    { ...valid, monthly: [...valid.monthly].reverse() },
    { ...valid, visits: 4 }, { ...valid, monthly: undefined },
    { ...valid, reportingTimezone: 'UTC' }]) assert.equal(validShapesSummary(value), false)
})
