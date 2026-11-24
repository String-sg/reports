'use client'
import { Select } from '@string-sg/ui/client'
import { useState } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
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

  return <section id="metrics" className="mb-12" aria-label="Shapes usage metrics">
    <h2 className="text-lg font-semibold text-foreground mb-5">Completed games</h2>
    <div className="mb-8 rounded-xl border border-border bg-card p-5">
      <p className="text-3xl font-bold text-foreground">{recordedCompletions ?? '—'}</p>
      <p className="mt-2 text-sm text-muted-foreground">
        {recordedCompletions
          ? 'Completed game records and validated completion reports, counted once per game.'
          : 'Completed game records are unavailable.'}
      </p>
      {checkedAt && <p className="mt-1 text-xs text-muted-foreground">
        Records checked <time dateTime={checkedAt}>{displayDate.format(new Date(checkedAt))}</time>.
      </p>}
      {dailyCompletions && dailyCompletions.undated > 0 && <p className="mt-1 text-xs text-muted-foreground">
        Of the total, {dailyCompletions.undated.toLocaleString('en-SG')} completions have no confirmed date.
      </p>}
    </div>
    {rows.length > 0 ? <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          One-off exercise. Reporting covers {periodLabel(firstDate, lastDate, displayDate)} in Singapore time.
          {grouping === 'week' && ' Weeks run Monday to Sunday within the reporting dates.'}
        </p>
        <Select label="Group by" value={grouping} onChange={event => setGrouping(event.target.value === 'day' ? 'day' : 'week')}>
          <option value="week">Week</option>
          <option value="day">Day</option>
        </Select>
      </div>
      <div className="mb-5 h-72 min-w-0" aria-label={`Completed games chart by ${grouping}`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 12, right: 14, bottom: 8, left: 0 }} accessibilityLayer>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={11} minTickGap={24} />
            <YAxis allowDecimals={false} width={36} stroke="var(--muted-foreground)" fontSize={11} />
            <Tooltip contentStyle={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              itemStyle={{ color: 'var(--foreground)' }} />
            <Line type="linear" dataKey="completedGames" name="Completed games" stroke="#36875d"
              strokeWidth={2} dot={{ r: grouping === 'day' ? 2 : 4 }} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border" role="region" aria-label="Scrollable completed games table" tabIndex={0}>
        <table className="w-full text-left text-sm" aria-label={`Completed games by ${grouping}`}>
          <thead className="bg-card"><tr>
            <th scope="col" className="p-3 font-semibold text-primary">{grouping === 'day' ? 'Date' : 'Week'}</th>
            <th scope="col" className="p-3 font-semibold text-primary">Completed games</th>
          </tr></thead>
          <tbody>{[...rows].reverse().map(row => <tr key={row.date} className="border-t border-border">
            <th scope="row" className="p-3 font-medium">{periodLabel(row.date, row.through, displayDate)}</th>
            <td className="p-3 tabular-nums">{row.completedGames.toLocaleString('en-SG')}</td>
          </tr>)}</tbody>
        </table>
      </div>
    </> : <p className="text-sm text-muted-foreground">Completion dates are unavailable.</p>}
  </section>
}
