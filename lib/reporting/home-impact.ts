import { teachingAdoption, estimatedHoursSaved, cumulativeReach, reviewedEvents, formatReach } from './overview'

export const homeImpact = [
  { value: formatReach(teachingAdoption.value), label: 'Educators applying String (estimate)' },
  { value: estimatedHoursSaved.toLocaleString('en-SG'), label: 'Estimated hours saved' },
  { value: formatReach(cumulativeReach), label: 'Cumulative reach' },
  { value: formatReach(reviewedEvents.participation, reviewedEvents.estimated), label: 'Event participation' },
]
export const homeImpactNote = 'All time'
