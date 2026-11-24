'use client'
import { MetricCard, ReportingPeriodSelect } from '@/components/report-metric-layout'
import { ReportPanel, ReportPanelHeading } from '@/components/report-panel'
import { useReportingPeriod } from '@/hooks/use-reporting-period'
import { eventReport, eventPeriods, eventTotals, formatEventDate } from '@/lib/reporting/events'

function EventList({ heading, events }: { heading: string; events: typeof eventReport.events }) {
  return (
    <ReportPanel>
      <ReportPanelHeading>{heading}</ReportPanelHeading>
      <ul className="report-event-list">
        {events.map(event => (
          <li key={event.id}>
            <a href={event.url} target="_blank" rel="noopener noreferrer">{event.title}</a>
            {event.date.includes('-H')
              ? <span>{formatEventDate(event.date)}</span>
              : <time dateTime={event.date}>{formatEventDate(event.date)}</time>}
          </li>
        ))}
      </ul>
    </ReportPanel>
  )
}

export function EventReport() {
  const selection = useReportingPeriod(eventPeriods.map(p => p.id))
  const totals = eventTotals(selection.period)
  const scheduled = eventReport.events.filter(event => event.status === 'upcoming' && new Date(`${event.date}T23:59:59+08:00`).getTime() >= Date.now())
  const participation = `${totals.participation.toLocaleString('en-SG')}${totals.estimated ? '+' : ''}`

  return (
    <div className="report-metric-stack">
      <ReportPanel>
        <ReportPanelHeading actions={<ReportingPeriodSelect {...selection} />}>Metrics</ReportPanelHeading>
        <div className="report-metric-body">
          <div aria-live="polite" className="report-metric-grid report-metric-grid-pair">
            <MetricCard label="Reported participation" value={participation} />
            <MetricCard label="Events" value={String(totals.events.length)} />
          </div>
          <p className="report-metric-note">Calendar reviewed {formatEventDate(eventReport.reviewedOn)} · Repeat participation included. Internal sessions excluded.</p>
        </div>
      </ReportPanel>

      <EventList heading="Event list" events={totals.events} />
      {selection.period === 'all' && scheduled.length > 0 && (
        <EventList heading="Scheduled events" events={scheduled} />
      )}
    </div>
  )
}
