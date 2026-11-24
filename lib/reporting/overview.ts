import { PROJECTS } from '../data'
import { eventTotals } from './events'
import reachGroups from '../../data/reach-groups.json'

export const teachingAdoption = { value: 1800, label: 'Organiser estimate', reportedOn: '2026-11-24' } as const
export const minutesSavedPerRemark = 2
export const currentProductSlugs = ['primary-2-shapes-adventure', 'diagrams', 'seating', 'bingo', 'pathways'] as const
export const pastProductSlugs = ['remarkscopilot', 'chergpt'] as const
export const partnerOrganisations = ['IAL', 'Meta', 'Google', 'AISG', 'Praxium / Crater', 'Stick ’Em', 'MonstarX']

export function overviewProject(slug: string) {
  const project = PROJECTS.find(project => project.slug === slug)
  if (!project) throw new Error(`Missing overview project: ${slug}`)
  return project
}
export function productMetric(slug: string, label: string) {
  return overviewProject(slug).metrics.find(metric => metric.label === label)?.value
}
export const remarksGenerated = Number(productMetric('remarkscopilot', 'Remarks generated')?.replaceAll(',', ''))
if (!Number.isSafeInteger(remarksGenerated) || remarksGenerated <= 0) throw new Error('Invalid remarks generation baseline')
export const estimatedHoursSaved = Math.round(remarksGenerated * minutesSavedPerRemark / 60)
export const pastProductReach = pastProductSlugs.reduce((total, slug) => total + (overviewProject(slug).teacherImpact ?? 0), 0)
export const pastReachDisplay = `${(Math.floor(pastProductReach / 100) * 100).toLocaleString('en-SG')}+`
export const productReach = pastProductReach + (overviewProject('diagrams').teacherImpact ?? 0)
export const reviewedEvents = eventTotals('all')
export const cumulativeReach = productReach + reviewedEvents.participation
export const eventReachGroups = reachGroups
export const formatReach = (value: number, estimated = true) => `${value.toLocaleString('en-SG')}${estimated ? '+' : ''}`

export const overviewCredits: Record<string, string> = {
  seating: 'By Jiaen', bingo: 'Inspired by Sengkwang', pathways: 'By Tiannuo, Evan and Matthew',
}
