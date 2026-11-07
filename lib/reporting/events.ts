import { z } from 'zod'
import source from '../../data/event-report.json'
import { periodFor } from './periods'

const eventDateSchema = z.union([z.string().date(), z.string().regex(/^20\d{2}-(?:0[1-9]|1[0-2]|H[12])$/)])
const eventSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+$/), date: eventDateSchema, title: z.string().min(1),
  url: z.string().url().regex(/^https:\/\/(?:luma\.com\/[a-z0-9]+|medium\.com\/string\/[a-z0-9-]+)$/),
  status: z.enum(['past', 'upcoming']),
}).strict()
const periodSchema = z.object({ id: z.string(), participation: z.number().int().nonnegative(), estimated: z.boolean() }).strict()
type Event = z.infer<typeof eventSchema>

function eventPeriodIds(event: Event) {
  const year = event.date.slice(0, 4)
  const ids = ['all', `year:${year}`]
  if (!event.date.includes('-H')) ids.push(`quarter:${year}-Q${Math.ceil(Number(event.date.slice(5, 7)) / 3)}`)
  return ids
}
function periodsForEvents(events: Event[]) {
  const ids = new Set(events.filter(e => e.status === 'past').flatMap(eventPeriodIds))
  ids.add('all')
  return [...ids].sort((a, b) => {
    if (a === 'all') return -1
    if (b === 'all') return 1
    const year = Number(b.match(/\d{4}/)![0]) - Number(a.match(/\d{4}/)![0])
    return year || Number(b.startsWith('year:')) - Number(a.startsWith('year:')) || b.localeCompare(a)
  }).map(periodFor)
}
function endsBeforeReview(date: string, review: string) {
  if (date.length === 10) return date < review
  const year = Number(date.slice(0, 4))
  // A partial date is past only when its entire month/half has elapsed.
  const endMonth = date.endsWith('H1') ? 6 : date.endsWith('H2') ? 12 : Number(date.slice(5, 7))
  const end = `${year + Math.floor(endMonth / 12)}-${String(endMonth % 12 + 1).padStart(2, '0')}-01`
  return end <= review
}
export const eventReportSchema = z.object({
  schemaVersion: z.literal(1), reviewedOn: z.string().date(),
  events: z.array(eventSchema), periods: z.array(periodSchema),
}).strict().superRefine((value, ctx) => {
  if (value.events.some(e => !eventDateSchema.safeParse(e.date).success)) return
  if (new Set(value.events.map(e => e.id)).size !== value.events.length)
    ctx.addIssue({ code: 'custom', message: 'Duplicate event' })
  for (const event of value.events) {
    const invalidUrl = event.url.startsWith('https://luma.com/') && event.url !== `https://luma.com/${event.id}`
    if (invalidUrl || (event.status === 'past') !== endsBeforeReview(event.date, value.reviewedOn))
      ctx.addIssue({ code: 'custom', message: 'Event URL or temporal status mismatch' })
  }
  const expected = periodsForEvents(value.events).map(p => p.id)
  if (value.periods.length !== expected.length || new Set(value.periods.map(p => p.id)).size !== expected.length || value.periods.some(p => !expected.includes(p.id)))
    ctx.addIssue({ code: 'custom', message: 'Period coverage mismatch' })
})

export const eventReport = eventReportSchema.parse(source)
export const eventPeriods = periodsForEvents(eventReport.events)
export function eventTotals(periodId: string) {
  periodFor(periodId)
  const metric = eventReport.periods.find(p => p.id === periodId)
  if (!metric) throw new Error('Event period unavailable')
  const events = eventReport.events.filter(e => e.status === 'past' && eventPeriodIds(e).includes(periodId))
  return { ...metric, events }
}
export function formatEventDate(date: string) {
  if (date.includes('-H')) return `${date.slice(5)} ${date.slice(0, 4)}`
  const fullDate = date.length === 7 ? `${date}-01` : date
  return new Date(`${fullDate}T12:00:00+08:00`).toLocaleDateString('en-SG', {
    ...(date.length === 10 ? { day: 'numeric' as const } : {}), month: 'short', year: 'numeric', timeZone: 'Asia/Singapore',
  })
}
