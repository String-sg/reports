import { test } from 'node:test'
import assert from 'node:assert/strict'
import { currentProductSlugs, eventReachGroups, reviewedEvents, cumulativeReach, productReach, teachingAdoption, estimatedHoursSaved, estimatedMinutesSaved, timeSavingsContributions, pastReachDisplay, overviewProject } from '../../lib/reporting/overview'

test('reach categories cover every reviewed past event once and reconcile public totals', () => {
  const ids = eventReachGroups.flatMap(group => group.eventIds)
  assert.equal(new Set(ids).size, ids.length)
  assert.deepEqual([...ids].sort(), reviewedEvents.events.map(event => event.id).sort())
  assert.equal(eventReachGroups.reduce((total, group) => total + group.participation, 0), reviewedEvents.participation)
  for (const group of eventReachGroups) assert.deepEqual(Object.keys(group).sort(), ['estimated', 'eventIds', 'name', 'participation'])
  assert.equal(cumulativeReach, productReach + reviewedEvents.participation)
})
test('owner-approved headline values retain their product attribution', () => {
  assert.deepEqual(teachingAdoption, { value: 1800, reportedOn: '2026-11-24' })
  assert.equal(cumulativeReach, 3863)
  const [remarks, diagrams] = timeSavingsContributions
  assert.equal(remarks.count, 61_252)
  assert.equal(remarks.minutesPerAction, 2)
  assert.ok(diagrams.count !== null && diagrams.count >= 0)
  assert.equal(diagrams.minutesPerAction, 4)
  assert.equal(estimatedMinutesSaved, 61_252 * 2 + diagrams.count * 4)
  assert.equal(estimatedHoursSaved, Math.round(estimatedMinutesSaved / 60))
  assert.equal(pastReachDisplay, '2,800+')
  assert.equal(currentProductSlugs.length, 5)
  for (const slug of ['seating','bingo','pathways']) assert.equal(overviewProject(slug).highlightStat.value, 'WIP')
  assert.deepEqual(overviewProject('pathways').contributors.map(c => c.name), ['Tiannuo','Evan','Matthew'])
  assert.equal(overviewProject('seating').contributors[0].name, 'Jiaen')
  assert.equal(overviewProject('bingo').contributors[0].role, 'Inspiration')
})
