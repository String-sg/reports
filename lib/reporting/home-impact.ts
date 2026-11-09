import { AGGREGATE, PROJECTS, eventParticipation } from '../data'
import { reportMetric } from './selectors'

const users = reportMetric('product-users-unique')?.value
const participants = reportMetric('event-participants-unique')?.value
const historicalProductReach = PROJECTS.filter(project => project.slug !== 'events')
  .reduce((total, project) => total + (project.teacherImpact ?? 0), 0)

export const homeImpact = [
  { value: String(AGGREGATE.totalProjects), label: 'Active products' },
  users == null
    ? { value: `${historicalProductReach.toLocaleString('en-SG')}+`, label: 'Historical product reach' }
    : { value: users.toLocaleString('en-SG'), label: 'Unique product users' },
  participants == null
    ? { value: eventParticipation, label: 'Reported event participation' }
    : { value: participants.toLocaleString('en-SG'), label: 'Unique event participants' },
  { value: `${AGGREGATE.totalVolunteers}+`, label: 'Volunteer contributors' },
]

export const homeImpactNote = [
  'All-time figures across covered sources.',
  users == null ? 'Historical product reach adds previously published figures and may count people more than once.' : '',
  participants == null ? 'Reported participation includes repeat visits.' : 'Product users and event participants may overlap.',
].filter(Boolean).join(' ')
