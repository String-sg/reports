import { test } from 'node:test'
import assert from 'node:assert/strict'
import { groupShapesCompletions } from '../../lib/shapes-completion-periods'

const firstDate = '2026-11-01'
const days = [
  { date: '2026-10-31', completedGames: 99 },
  { date: '2026-11-02', completedGames: 3 },
  { date: '2026-11-08', completedGames: 5 },
  { date: '2026-11-09', completedGames: 7 },
  { date: '2026-11-10', completedGames: 11 },
]

test('weekly completions clip Sunday at the start and the last week at the Singapore check date', () => {
  const rows = groupShapesCompletions(days, firstDate, '2026-11-09T15:59:59.999Z', 'week')
  assert.deepEqual(rows, [
    { date: '2026-11-01', through: '2026-11-01', completedGames: 0 },
    { date: '2026-11-02', through: '2026-11-08', completedGames: 8 },
    { date: '2026-11-09', through: '2026-11-09', completedGames: 7 },
  ])
})

test('daily completions fill zero days and agree with the weekly total at Singapore midnight', () => {
  const checkedAt = '2026-11-09T16:00:00.000Z'
  const daily = groupShapesCompletions(days, firstDate, checkedAt, 'day')
  const weekly = groupShapesCompletions(days, firstDate, checkedAt, 'week')
  assert.equal(daily.length, 10)
  assert.deepEqual(daily.map(row => row.completedGames), [0, 3, 0, 0, 0, 0, 0, 5, 7, 11])
  assert.deepEqual(weekly.at(-1), { date: '2026-11-09', through: '2026-11-10', completedGames: 18 })
  assert.equal(daily.reduce((sum, row) => sum + row.completedGames, 0), weekly.reduce((sum, row) => sum + row.completedGames, 0))
})
