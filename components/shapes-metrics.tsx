'use client'
import { Select } from '@string-sg/ui/client'
import { useState } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ReportPanel, ReportPanelHeading } from '@/components/report-panel'
import type { ShapesDailyCompletions } from '@/lib/reporting/schema'
import { groupShapesCompletions, type ShapesGrouping } from '@/lib/shapes-completion-periods'

const displayDate = new Intl.DateTimeFormat('en-SG', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Singapore' })
const periodDate = new Intl.DateTimeFormat('en-SG', { day: 'numeric', month: 'short', timeZone: 'UTC' })

function periodLabel(date: string, through: string, format = periodDate) {
  return date === through
    ? format.format(new Date(date))
    : format.formatRange(new Date(date), new Date(through))
}

export function ShapesMetrics({ recordedCompletions, checkedAt, dailyCompletions, firstDate, lastDate }: {
  recordedCompletions: string | null
  checkedAt: string | null
  dailyCompletions: ShapesDailyCompletions | null
  firstDate: string
  lastDate: string
}) {
  const [grouping, setGrouping] = useState<ShapesGrouping>('week')
  const rows = dailyCompletions && checkedAt
    ? groupShapesCompletions(dailyCompletions.days, firstDate, lastDate, checkedAt, grouping).map(period => ({
      ...period,
      label: periodLabel(period.date, period.through),
    }))
    : []

  const periodControl = rows.length > 0 && (
    <Select label="Group by" value={grouping} onChange={event => setGrouping(event.target.value === 'day' ? 'day' : 'week')}>
      <option value="week">Week</option>
      <option value="day">Day</option>
    </Select>
  )

  return (
    <section id="metrics" aria-label="Shapes usage metrics">
      <ReportPanel>
        <ReportPanelHeading actions={periodControl}>Completed games</ReportPanelHeading>
        <div className="report-metric-body report-metric-stack">
          <div className="grid gap-1">
            <p className="report-metric-value">{recordedCompletions ?? '—'}</p>
            <p className="report-metric-note">
              {recordedCompletions
                ? 'Completed game records and validated completion reports, counted once per game.'
                : 'Completed game records are unavailable.'}
            </p>
            {checkedAt && <p className="report-metric-note">
              Records checked <time dateTime={checkedAt}>{displayDate.format(new Date(checkedAt))}</time>.
            </p>}
            {dailyCompletions && dailyCompletions.undated > 0 && <p className="report-metric-note">
              Of the total, {dailyCompletions.undated.toLocaleString('en-SG')} completions have no confirmed date.
            </p>}
          </div>
          {rows.length > 0 ? <>
            <p className="report-metric-note">
              One-off exercise. Reporting covers {periodLabel(firstDate, lastDate, displayDate)} in Singapore time.
              {grouping === 'week' && ' Weeks run Monday to Sunday within the reporting dates.'}
            </p>
            <div className="report-metric-chart" aria-label={`Completed games chart by ${grouping}`}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rows} margin={{ top: 12, right: 14, bottom: 8, left: 0 }} accessibilityLayer>
                  <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" />
                  <XAxis dataKey="label" stroke="var(--muted)" fontSize={11} minTickGap={24} />
                  <YAxis allowDecimals={false} width={36} stroke="var(--muted)" fontSize={11} />
                  <Tooltip contentStyle={{ background: 'var(--card)', borderColor: 'var(--line)', color: 'var(--ink)' }}
                    itemStyle={{ color: 'var(--ink)' }} />
                  <Line type="linear" dataKey="completedGames" name="Completed games" stroke="var(--report-link)"
                    strokeWidth={2} dot={{ r: grouping === 'day' ? 2 : 4 }} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="report-metric-table" role="region" aria-label="Scrollable completed games table" tabIndex={0}>
              <table aria-label={`Completed games by ${grouping}`}>
                <thead><tr>
                  <th scope="col">{grouping === 'day' ? 'Date' : 'Week'}</th>
                  <th scope="col">Completed games</th>
                </tr></thead>
                <tbody>{[...rows].reverse().map(row => <tr key={row.date}>
                  <th scope="row">{periodLabel(row.date, row.through, displayDate)}</th>
                  <td>{row.completedGames.toLocaleString('en-SG')}</td>
                </tr>)}</tbody>
              </table>
            </div>
          </> : <p className="report-metric-note">Completion dates are unavailable.</p>}
        </div>
      </ReportPanel>
    </section>
  )
}
