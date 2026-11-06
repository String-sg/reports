import { test } from 'node:test'
import assert from 'node:assert/strict'
import { lumaCatalogue, lumaPeriods, lumaTotals } from '../../lib/reporting/luma-events'

test('Luma reconciliation keeps check-ins, Going RSVPs and unique people distinct', () => {
  const all = lumaTotals('all')
  assert.equal(all.events.length, 16)
  assert.equal(all.going, 416)
  assert.equal(all.checkedIn, 260)
  assert.equal(all.recordedEvents, 11)
  assert.equal(all.events.find(e => e.id === 'ktuev6vq')?.checkedIn, 55)
  assert.equal(all.events.find(e => e.id === '01qogcdp')?.going, 44)
  assert.equal(all.events.find(e => e.id === 'ymk0bf9n')?.checkedIn, null)
  assert.equal('uniqueParticipants' in all, false)
})

test('upcoming events stay outside impact totals and periods use occurrence dates', () => {
  assert.equal(lumaCatalogue.events.filter(e => e.status === 'upcoming').length, 1)
  assert.equal(lumaTotals('all').events.some(e => e.id === '3tiwjwll'), false)
  assert.equal(lumaTotals('year:2026').checkedIn, 175)
  assert.equal(lumaTotals('year:2025').checkedIn, 85)
  assert.equal(lumaTotals('quarter:2026-Q2').checkedIn, 27)
  assert.equal(lumaTotals('quarter:2026-Q3').checkedIn, 93)
  assert.equal(lumaTotals('quarter:2026-Q4').checkedIn, null)
  assert.equal(lumaTotals('quarter:2026-Q4').going, 5)
  assert.ok(lumaPeriods.some(p => p.id === 'quarter:2025-Q2'))
})
