import { AGGREGATE, PROJECTS, eventParticipation } from '../data'
import { eventTotals } from './events'
import { reportMetric } from './selectors'

const users = reportMetric('product-users-unique')?.value
const participants = reportMetric('event-participants-unique')?.value
const reachProducts = new Set(['remarkscopilot', 'chergpt', 'diagrams'])
const cumulativeReach = PROJECTS.filter(project => reachProducts.has(project.slug))
  .reduce((total, project) => total + (project.teacherImpact ?? 0), eventTotals('all').participation)

export const homeImpact = [
  { value: String(AGGREGATE.totalProjects), label: 'Active products' },
  { value: `${cumulativeReach.toLocaleString('en-SG')}+`, label: 'Cumulative reported reach' },
  participants == null
    ? { value: eventParticipation, label: 'Reported event participation' }
    : { value: participants.toLocaleString('en-SG'), label: 'Unique event participants' },
  { value: `${AGGREGATE.totalVolunteers}+`, label: 'Volunteer contributors' },
]

export const homeImpactNote = [
  'All-time figures across covered sources.',
  'Cumulative reach adds selected product figures and reported event participation. People may appear more than once.',
  users == null ? '' : `${users.toLocaleString('en-SG')} unique product users across verified sources.`,
].filter(Boolean).join(' ')
