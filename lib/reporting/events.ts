import { z } from 'zod'
import source from '../../data/event-report.json'
import { inPeriod, periodFor, periodsFor } from './periods'

const eventSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+$/), date: z.string().date(), title: z.string().min(1),
  url: z.string().url().regex(/^https:\/\/luma\.com\/[a-z0-9]+$/),
  status: z.enum(['past', 'upcoming']),
}).strict()
const periodSchema = z.object({ id: z.string(), participation: z.number().int().nonnegative(), estimated: z.boolean() }).strict()
export const eventReportSchema = z.object({
  schemaVersion: z.literal(1), reviewedOn: z.string().date(),
  events: z.array(eventSchema), periods: z.array(periodSchema),
}).strict().superRefine((value, ctx) => {
  if (new Set(value.events.map(e => e.id)).size !== value.events.length)
    ctx.addIssue({ code: 'custom', message: 'Duplicate event' })
  for (const event of value.events) {
    if (event.url !== `https://luma.com/${event.id}` || (event.status === 'past') !== (event.date < value.reviewedOn))
      ctx.addIssue({ code: 'custom', message: 'Event URL or temporal status mismatch' })
  }
  const expected = periodsFor(value.events.filter(e => e.status === 'past').map(e => `${e.date}T12:00:00+08:00`)).map(p => p.id)
  if (value.periods.length !== expected.length || new Set(value.periods.map(p => p.id)).size !== expected.length || value.periods.some(p => !expected.includes(p.id)))
    ctx.addIssue({ code: 'custom', message: 'Period coverage mismatch' })
})

export const eventReport = eventReportSchema.parse(source)
export const eventPeriods = periodsFor(eventReport.events.filter(e => e.status === 'past').map(e => `${e.date}T12:00:00+08:00`))
export function eventTotals(periodId: string) {
  const period = periodFor(periodId)
  const metric = eventReport.periods.find(p => p.id === periodId)
  if (!metric) throw new Error('Event period unavailable')
  const events = eventReport.events.filter(e => e.status === 'past' && inPeriod(`${e.date}T12:00:00+08:00`, period))
  return { ...metric, events }
}
