import { test } from 'node:test'
import assert from 'node:assert/strict'
import { shapesReportingUsage, validShapesSummary } from '../lib/shapes-summary.ts'
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

test('public Shapes reporting removes internal months and preserves later rolling counts', () => {
  const november = { month: '2026-11', visits: 15, gamesStarted: 3, gamesCompleted: 3 }
  const december = { month: '2026-12', visits: 4, gamesStarted: 2, gamesCompleted: 1 }
  const novemberRead = {
    ...valid,
    generatedAt: '2026-11-24T00:00:00.000Z',
    visits: 16, gamesStarted: 3, gamesCompleted: 3,
    allTime: { visits: 18, gamesStarted: 3, gamesCompleted: 3 },
    monthly: [...valid.monthly, november],
  }
  const current = shapesReportingUsage(novemberRead)
  assert.deepEqual(current.monthly, [november])
  assert.deepEqual(current.allTime, { visits: 15, gamesStarted: 3, gamesCompleted: 3 })
  assert.deepEqual(current.recent, current.allTime)

  const decemberRead = {
    ...novemberRead,
    generatedAt: '2026-12-08T00:00:00.000Z',
    visits: 9, gamesStarted: 4, gamesCompleted: 2,
    allTime: { visits: 22, gamesStarted: 5, gamesCompleted: 4 },
    monthly: [...novemberRead.monthly, december],
  }
  const later = shapesReportingUsage(decemberRead)
  assert.deepEqual(later.monthly, [november, december])
  assert.deepEqual(later.allTime, { visits: 19, gamesStarted: 5, gamesCompleted: 4 })
  assert.equal(later.recent.visits, 9)
})
