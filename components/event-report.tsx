"use client"
import { Select } from '@string-sg/ui/client'
import { useReportingPeriod } from '@/hooks/use-reporting-period'
import { lumaCatalogue, lumaPeriods, lumaTotals } from '@/lib/reporting/luma-events'
import { periodFor } from '@/lib/reporting/periods'

const formatDate = (date: string) => new Date(`${date}T12:00:00+08:00`).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Singapore' })

export function EventReport() {
  const { period, allowed, choose } = useReportingPeriod(lumaPeriods.map(p => p.id))
  const totals = lumaTotals(period)
  const cards = [
    { label: 'Recorded check-ins', value: totals.checkedIn?.toLocaleString('en-SG') ?? '—', note: `Check-in totals recorded for ${totals.recordedEvents} of ${totals.events.length} listed events. Repeat visits count again.` },
    { label: 'Going RSVPs', value: totals.going.toLocaleString('en-SG'), note: 'Current Going status, summed across events. These are registrations, not attendance or unique people.' },
    { label: 'Past Luma event listings', value: String(totals.events.length), note: 'Educator and community listings; internal or operational sessions excluded.' },
    { label: 'Unique event participants', value: '—', note: 'Not yet available. Checked-in guest records must be deduplicated across events first.' },
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
        <p className="text-xs text-muted-foreground mt-2">{card.note}</p>
      </div>)}
    </div>
    <p className="text-xs text-muted-foreground mt-4">Checked against Luma on {formatDate(lumaCatalogue.checkedOn)}. Check-in coverage is partial; an absent check-in total does not mean nobody attended. Older events outside Luma are not included in these totals.</p>
    <p className="text-xs text-muted-foreground mt-2">The previous 527 “educators impacted” figure mixed historical estimates and guest totals. It has not been validated as attendance or distinct people.</p>
    <h3 className="text-base font-semibold mt-8 mb-4">Events in this period</h3>
    <ul className="space-y-4">
      {totals.events.map(event => <li key={event.id} className="border-b border-border pb-4">
        <a className="font-medium text-primary hover:underline" href={event.url} target="_blank" rel="noopener noreferrer">{event.title}</a>
        <p className="text-sm text-muted-foreground mt-1">{formatDate(event.date)} · {event.going} Going RSVPs · {event.checkedIn === null ? 'Check-in total not recorded' : `${event.checkedIn} recorded check-ins`}</p>
      </li>)}
    </ul>
    {period === 'all' && <div className="mt-8"><h3 className="font-semibold mb-3">Upcoming — excluded from impact totals</h3>
      {lumaCatalogue.events.filter(e => e.status === 'upcoming').map(event => <p key={event.id} className="text-sm text-muted-foreground"><a className="text-primary hover:underline" href={event.url} target="_blank" rel="noopener noreferrer">{event.title}</a> · {formatDate(event.date)}</p>)}
    </div>}
  </div>
}
