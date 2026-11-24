'use client'
import { useEffect, useState } from 'react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { ShapesMonthlyCompletions } from '@/lib/reporting/schema'
import type { ShapesSummary, UsageCounts } from '@/lib/shapes-summary'

const metrics = [
  { name: 'Visits', key: 'visits', stroke: 'var(--primary)', dash: undefined },
  { name: 'Games started', key: 'gamesStarted', stroke: 'var(--accent)', dash: '6 3' },
  { name: 'Opt-in completion events', key: 'gamesCompleted', stroke: '#FFB86B', dash: '2 3' },
] as const
const reconciledLabel = 'Reconciled completed games'
const monthFormat = new Intl.DateTimeFormat('en-SG', { month: 'short', year: 'numeric', timeZone: 'Asia/Singapore' })

function CountCards({ counts }: { counts: UsageCounts }) {
  return <div className="grid sm:grid-cols-3 gap-4">
    {metrics.map(({ name, key }) => <div key={key} className="rounded-xl bg-card border border-border p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">{name}</p>
      <p className="text-3xl font-bold text-foreground">{counts[key].toLocaleString()}</p>
    </div>)}
  </div>
}
function monthLabel(month: string) {
  return monthFormat.format(new Date(`${month}-01T00:00:00Z`))
}

function MonthlyTrends({ summary, monthlyCompletions, checkedAt }: {
  summary: ShapesSummary | null
  monthlyCompletions: ShapesMonthlyCompletions | null
  checkedAt: string | null
}) {
  const optIn = new Map(summary?.monthly.map(row => [row.month, row]))
  const reconciled = new Map(monthlyCompletions?.months.map(row => [row.month, row.completedGames]))
  const optInMonth = summary ? monthFormat.format(new Date(summary.generatedAt)) : null
  const reconciledMonth = checkedAt ? monthFormat.format(new Date(checkedAt)) : null
  const rows = [...new Set([...optIn.keys(), ...reconciled.keys()])].sort().map(month => {
    const activity = optIn.get(month)
    const completed = reconciled.get(month)
    const label = monthLabel(month)
    return {
      month,
      label,
      partial: (activity && label === optInMonth) || (completed !== undefined && label === reconciledMonth),
      visits: activity?.visits ?? null,
      gamesStarted: activity?.gamesStarted ?? null,
      gamesCompleted: activity?.gamesCompleted ?? null,
      reconciled: completed ?? null,
    }
  })
  const chartRows = rows.slice(-12)
  const showOptIn = chartRows.some(row => row.visits !== null)
  const showReconciled = chartRows.some(row => row.reconciled !== null)

  return <section aria-label="Monthly trends" className="mb-4">
    <h2 className="text-lg font-semibold text-foreground mb-2">Monthly trends</h2>
    <p className="text-xs text-muted-foreground mb-4">
      Calendar months in Singapore time. Partial months reflect each source’s check date.
      {showOptIn && showReconciled && ' The left scale shows opt-in events. The right scale shows reconciled games.'}
    </p>
    {monthlyCompletions && monthlyCompletions.undated > 0 && <p className="text-xs text-muted-foreground mb-4">
      Of the all-time total, {monthlyCompletions.undated.toLocaleString('en-SG')} completions have no confirmed month.
    </p>}
    {rows.length ? <>
      <div className="h-72 min-w-0 mb-5" aria-label="Monthly usage chart, latest 12 months">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartRows} margin={{ top: 12, right: 8, bottom: 8, left: 0 }} accessibilityLayer>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis dataKey="month" tickFormatter={monthLabel} stroke="var(--muted-foreground)" fontSize={11} />
            {showOptIn && <YAxis yAxisId="opt-in" width={36} allowDecimals={false} stroke="var(--muted-foreground)" fontSize={11} />}
            {showReconciled && <YAxis yAxisId="reconciled" orientation="right" width={38} allowDecimals={false} stroke="var(--muted-foreground)" fontSize={11} />}
            <Tooltip labelFormatter={label => monthLabel(String(label))} contentStyle={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {showOptIn && metrics.map(({ key, name, stroke, dash }) => (
              <Line key={key} yAxisId="opt-in" type="linear" dataKey={key} name={name} stroke={stroke}
                strokeWidth={2} strokeDasharray={dash} isAnimationActive={false} />
            ))}
            {showReconciled && <Line yAxisId="reconciled" type="linear" dataKey="reconciled" name={reconciledLabel}
              stroke="#b05a7d" strokeWidth={2} dot={{ r: 4 }} isAnimationActive={false} />}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-muted-foreground mb-3">Chart covers the latest 12 recorded months. A dash in the table marks an unavailable count.</p>
      <div className="overflow-x-auto rounded-xl border border-border" role="region" aria-label="Scrollable monthly counts" tabIndex={0}>
        <table className="w-full text-sm text-left" aria-label="Monthly activity counts">
          <thead className="bg-card"><tr>
            <th scope="col" className="p-3 font-semibold text-primary">Month</th>
            {metrics.map(({ key, name }) => <th key={key} scope="col" className="p-3 font-semibold text-primary">{name}</th>)}
            {monthlyCompletions && <th scope="col" className="p-3 font-semibold text-primary">{reconciledLabel}</th>}
          </tr></thead>
          <tbody>{[...rows].reverse().map(row => <tr key={row.month} className="border-t border-border">
            <th scope="row" className="p-3 font-medium whitespace-nowrap">{row.label}{row.partial && ' (partial)'}</th>
            {metrics.map(({ key }) => <td key={key} className="p-3 tabular-nums">{row[key]?.toLocaleString('en-SG') ?? '—'}</td>)}
            {monthlyCompletions && <td className="p-3 tabular-nums">{row.reconciled?.toLocaleString('en-SG') ?? '—'}</td>}
          </tr>)}</tbody>
        </table>
      </div>
    </> : <p className="text-sm text-muted-foreground">Monthly trends will appear after the first recorded activity.</p>}
  </section>
}

export function ShapesMetrics({ recordedCompletions, checkedAt, monthlyCompletions }: {
  recordedCompletions: string | null
  checkedAt: string | null
  monthlyCompletions: ShapesMonthlyCompletions | null
}) {
  const [summary, setSummary] = useState<ShapesSummary | null>(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/shapes-metrics', { signal: controller.signal })
      .then(async response => { if (!response.ok) throw new Error('unavailable'); return response.json() })
      .then(setSummary).catch(() => { if (!controller.signal.aborted) setFailed(true) })
    return () => controller.abort()
  }, [])
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
        Records checked <time dateTime={checkedAt}>{new Date(checkedAt).toLocaleDateString('en-SG', {
          timeZone: 'Asia/Singapore', day: 'numeric', month: 'short', year: 'numeric',
        })}</time>.
      </p>}
    </div>
    <h2 className="text-lg font-semibold text-foreground mb-2">Opt-in activity</h2>
    <p className="text-sm text-muted-foreground mb-4">Opt-in activity counts, not unique pupils or learning outcomes. Names, classes, answers and scores are excluded. Declined analytics and blocked requests are not counted.</p>
    {summary ? <>
      <div aria-label="All-time totals" className="mb-8">
        <h3 className="font-semibold text-foreground mb-2">All-time totals</h3>
        <p className="text-xs text-muted-foreground mb-4">{summary.firstEventAt ? `Since the first recorded event on ${new Date(summary.firstEventAt).toLocaleDateString('en-SG', { timeZone: 'Asia/Singapore', day: 'numeric', month: 'short', year: 'numeric' })}. Earlier usage was not tracked.` : 'No usage recorded yet.'}</p>
        <CountCards counts={summary.allTime} />
      </div>
      <div aria-label="Last 30 days" className="mb-8">
        <h3 className="font-semibold text-foreground mb-4">Last 30 days</h3>
        <CountCards counts={summary} />
      </div>
      <p className="text-xs text-muted-foreground mb-8">Opt-in activity updated {new Date(summary.generatedAt).toLocaleString('en-SG', { timeZone: 'Asia/Singapore' })} SGT. Refreshed about every five minutes.</p>
    </> : <p role="status" className="text-sm text-muted-foreground mb-8">{failed ? 'Usage metrics are temporarily unavailable. Please try again later.' : 'Loading usage metrics…'}</p>}
    <MonthlyTrends summary={summary} monthlyCompletions={monthlyCompletions} checkedAt={checkedAt} />
  </section>
}
