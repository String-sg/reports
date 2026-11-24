"use client"
import { Select } from '@string-sg/ui/client'
import { useReportingPeriod } from '@/hooks/use-reporting-period'
import { eventReport, eventPeriods, eventTotals, formatEventDate } from '@/lib/reporting/events'
import { periodFor } from '@/lib/reporting/periods'

const formatDate = formatEventDate

export function EventReport() {
  const { period, allowed, choose } = useReportingPeriod(eventPeriods.map(p => p.id))
  const totals = eventTotals(period)
  const scheduled = eventReport.events.filter(event => event.status === 'upcoming' && new Date(`${event.date}T23:59:59+08:00`).getTime() >= Date.now())
  const cards = [
    { label: 'Reported participation', value: `${totals.participation.toLocaleString('en-SG')}${totals.estimated ? '+' : ''}` },
    { label: 'Events', value: String(totals.events.length) },
  ]
  return <div>
    <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
      <h2 className="text-lg font-semibold text-foreground">Metrics</h2>
      <Select label="Reporting period" value={period} onChange={e => choose(e.target.value)}>
        {allowed.map(id => <option key={id} value={id}>{periodFor(id).label}</option>)}
      </Select>
    </div>
    <div aria-live="polite" className="grid sm:grid-cols-2 gap-4">
      {cards.map(card => <div key={card.label} className="rounded-xl bg-card border border-border p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">{card.label}</p>
        <p className="text-3xl font-bold text-foreground">{card.value}</p>
      </div>)}
    </div>
    <p className="text-xs text-muted-foreground mt-4">Calendar reviewed {formatDate(eventReport.reviewedOn)} · Repeat participation included. Internal sessions excluded.</p>
    <h3 className="text-base font-semibold mt-8 mb-4">Event list</h3>
    <ul className="space-y-4">
      {totals.events.map(event => <li key={event.id} className="border-b border-border pb-4">
        <a className="font-medium text-primary hover:underline" href={event.url} target="_blank" rel="noopener noreferrer">{event.title}</a>
        <p className="text-sm text-muted-foreground mt-1">{formatDate(event.date)}</p>
      </li>)}
    </ul>
    {period === 'all' && scheduled.length > 0 && <div className="mt-8"><h3 className="font-semibold mb-3">Scheduled events</h3>
      {scheduled.map(event => <p key={event.id} className="text-sm text-muted-foreground"><a className="text-primary hover:underline" href={event.url} target="_blank" rel="noopener noreferrer">{event.title}</a> · {formatDate(event.date)}</p>)}
    </div>}
  </div>
}
