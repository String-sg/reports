import { test } from 'node:test'
import assert from 'node:assert/strict'
import { currentProductSlugs, eventReachGroups, reviewedEvents, cumulativeReach, productReach, teachingAdoption, estimatedHoursSaved, pastReachDisplay, overviewProject } from '../../lib/reporting/overview'

test('reach categories cover every reviewed past event once and reconcile public totals', () => {
  const ids = eventReachGroups.flatMap(group => group.eventIds)
  assert.equal(new Set(ids).size, ids.length)
  assert.deepEqual([...ids].sort(), reviewedEvents.events.map(event => event.id).sort())
  assert.equal(eventReachGroups.reduce((total, group) => total + group.participation, 0), reviewedEvents.participation)
  for (const group of eventReachGroups) assert.deepEqual(Object.keys(group).sort(), ['estimated', 'eventIds', 'name', 'participation'])
  assert.equal(cumulativeReach, productReach + reviewedEvents.participation)
})
test('owner-approved estimates retain their evidence labels and product attribution', () => {
  assert.deepEqual(teachingAdoption, { value: 1800, label: 'Organiser estimate', reportedOn: '2026-11-24' })
  assert.equal(estimatedHoursSaved, 2042)
  assert.equal(pastReachDisplay, '2,800+')
  assert.equal(currentProductSlugs.length, 5)
  for (const slug of ['seating','bingo','pathways']) assert.equal(overviewProject(slug).highlightStat.value, 'WIP')
  assert.deepEqual(overviewProject('pathways').contributors.map(c => c.name), ['Tiannuo','Evan','Matthew'])
  assert.equal(overviewProject('seating').contributors[0].name, 'Jiaen')
  assert.equal(overviewProject('bingo').contributors[0].role, 'Inspiration')
})
