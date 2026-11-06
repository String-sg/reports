import { z } from 'zod'
import source from '../../data/luma-events.json'
import { inPeriod, periodFor, periodsFor } from './periods'

const count = z.number().int().nonnegative().nullable()
const eventSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+$/),
  date: z.string().date(),
  title: z.string().min(1),
  url: z.string().url().regex(/^https:\/\/luma\.com\/[a-z0-9]+$/),
  status: z.enum(['past', 'upcoming']),
  going: count,
  checkedIn: count,
}).strict()
const catalogueSchema = z.object({
  schemaVersion: z.literal(1), checkedOn: z.string().date(), scope: z.string(),
  events: z.array(eventSchema),
}).strict().superRefine((value, ctx) => {
  if (new Set(value.events.map(e => e.id)).size !== value.events.length)
    ctx.addIssue({ code: 'custom', message: 'Duplicate Luma event' })
  for (const event of value.events) {
    if (event.url !== `https://luma.com/${event.id}` ||
        (event.status === 'past') !== (event.date < value.checkedOn))
      ctx.addIssue({ code: 'custom', message: 'Event URL or temporal status mismatch' })
    if (event.checkedIn !== null && event.going !== null && event.checkedIn > event.going)
      ctx.addIssue({ code: 'custom', message: 'Check-ins exceed Going RSVPs; review source' })
  }
})

export const lumaCatalogue = catalogueSchema.parse(source)
export type LumaEvent = z.infer<typeof eventSchema>
export const lumaPeriods = periodsFor(lumaCatalogue.events.filter(e => e.status === 'past').map(e => `${e.date}T12:00:00+08:00`))

export function lumaTotals(periodId: string) {
  const period = periodFor(periodId)
  const events = lumaCatalogue.events.filter(e => e.status === 'past' && inPeriod(`${e.date}T12:00:00+08:00`, period))
  const recorded = events.filter(e => e.checkedIn !== null)
  return {
    events,
    going: events.reduce((sum, e) => sum + (e.going ?? 0), 0),
    checkedIn: recorded.length ? recorded.reduce((sum, e) => sum + e.checkedIn!, 0) : null,
    recordedEvents: recorded.length,
  }
}
