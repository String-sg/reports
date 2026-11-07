import { test } from 'node:test'
import assert from 'node:assert/strict'
import { eventReport, eventReportSchema, eventPeriods, eventTotals, formatEventDate } from '../../lib/reporting/events'

test('public event report contains period aggregates without source breakdowns', () => {
  const all = eventTotals('all')
  assert.equal(all.participation, 777)
  assert.equal(all.estimated, true)
  assert.equal(all.events.length, 18)
  assert.equal(eventTotals('year:2026').participation, 499)
  assert.equal(eventTotals('year:2025').participation, 148)
  assert.equal(eventTotals('quarter:2026-Q2').participation, 280)
  assert.equal(eventTotals('quarter:2026-Q3').participation, 134)
  assert.equal(eventTotals('year:2025').estimated, false)
  assert.equal(eventTotals('year:2026').participation + eventTotals('year:2025').participation + eventTotals('year:2023').participation, all.participation)
})
test('public allowlist rejects private source counts at every level', () => {
  assert.equal(eventReportSchema.safeParse({ ...eventReport, luma: 123 }).success, false)
  const row = structuredClone(eventReport)
  Object.assign(row.events[0], { going: 123, non_luma: 456 })
  assert.equal(eventReportSchema.safeParse(row).success, false)
  const period = structuredClone(eventReport)
  Object.assign(period.periods[0], { organiserTotal: 123 })
  assert.equal(eventReportSchema.safeParse(period).success, false)
})
test('upcoming events stay outside totals and missing periods are unavailable', () => {
  assert.equal(eventReport.events.filter(e => e.status === 'upcoming').length, 1)
  assert.equal(eventTotals('all').events.some(e => e.id === '3tiwjwll'), false)
  assert.equal(eventTotals('quarter:2026-Q4').participation, 5)
  assert.ok(eventPeriods.some(p => p.id === 'quarter:2025-Q2'))
  assert.throws(() => eventTotals('year:2024'), /unavailable/)
})

test('historical partial dates preserve known precision and do not invent quarters', () => {
  assert.equal(eventTotals('year:2023').participation, 130)
  assert.equal(eventTotals('year:2023').events.length, 2)
  assert.equal(eventTotals('quarter:2023-Q4').participation, 80)
  assert.equal(eventTotals('quarter:2023-Q4').events.length, 1)
  assert.equal(eventPeriods.some(p => p.id === 'quarter:2023-Q1' || p.id === 'quarter:2023-Q2'), false)
  assert.equal(formatEventDate('2023-H1'), 'H1 2023')
  assert.equal(formatEventDate('2023-11'), 'Nov 2023')
  const invalid = structuredClone(eventReport)
  invalid.events.find(e => e.id === 'meta2023')!.date = '2023-13'
  assert.equal(eventReportSchema.safeParse(invalid).success, false)
  const notYetPast = structuredClone(eventReport)
  notYetPast.events.find(e => e.id === 'meta2023')!.date = '2026-11'
  assert.equal(eventReportSchema.safeParse(notYetPast).success, false)
})
