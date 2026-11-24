'use client'
import { useEffect, useState } from 'react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { ShapesSummary, UsageCounts } from '@/lib/shapes-summary'

const metrics = [['Visits', 'visits'], ['Games started', 'gamesStarted'], ['Games completed', 'gamesCompleted']] as const
function CountCards({ counts }: { counts: UsageCounts }) {
  return <div className="grid sm:grid-cols-3 gap-4">
    {metrics.map(([label, key]) => <div key={key} className="rounded-xl bg-card border border-border p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">{label}</p>
      <p className="text-3xl font-bold text-foreground">{counts[key].toLocaleString()}</p>
    </div>)}
  </div>
}
function monthLabel(month: string) {
  return new Date(`${month}-01T00:00:00Z`).toLocaleDateString('en-SG', { month: 'short', year: 'numeric', timeZone: 'Asia/Singapore' })
}
export function ShapesMetrics() {
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
    <h2 className="text-lg font-semibold text-foreground mb-5">Usage</h2>
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
      <div aria-label="Monthly trends" className="mb-4">
        <h3 className="font-semibold text-foreground mb-2">Monthly trends</h3>
        <p className="text-xs text-muted-foreground mb-4">Calendar months in Singapore time. The latest month is partial. Zero-activity months are included from the first recorded event.</p>
        {summary.monthly.length ? <>
          <div className="h-72 min-w-0 mb-5" aria-label="Monthly usage chart, latest 12 months">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={summary.monthly.slice(-12)} margin={{ top: 12, right: 16, bottom: 8, left: -20 }} accessibilityLayer>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="month" tickFormatter={monthLabel} stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis allowDecimals={false} stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip labelFormatter={label => monthLabel(String(label))} contentStyle={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
                <Legend />
                <Line type="linear" dataKey="visits" name="Visits" stroke="var(--primary)" strokeWidth={2} isAnimationActive={false} />
                <Line type="linear" dataKey="gamesStarted" name="Games started" stroke="var(--accent)" strokeWidth={2} strokeDasharray="6 3" isAnimationActive={false} />
                <Line type="linear" dataKey="gamesCompleted" name="Games completed" stroke="#FFB86B" strokeWidth={2} strokeDasharray="2 3" isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Chart: latest 12 months. Table: all recorded months.</p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm text-left" aria-label="Monthly activity counts">
              <thead className="bg-card"><tr>{['Month', 'Visits', 'Started', 'Completed'].map(label => <th key={label} scope="col" className="p-3 font-semibold text-primary">{label}</th>)}</tr></thead>
              <tbody>{[...summary.monthly].reverse().map((row, index) => <tr key={row.month} className="border-t border-border">
                <th scope="row" className="p-3 font-medium whitespace-nowrap">{monthLabel(row.month)}{index === 0 ? ' (partial)' : ''}</th>
                {metrics.map(([, key]) => <td key={key} className="p-3 tabular-nums">{row[key].toLocaleString()}</td>)}
              </tr>)}</tbody>
            </table>
          </div>
        </> : <p className="text-sm text-muted-foreground">Monthly trends will appear after the first recorded event.</p>}
      </div>
      <p className="text-xs text-muted-foreground mt-3">Updated {new Date(summary.generatedAt).toLocaleString('en-SG', { timeZone: 'Asia/Singapore' })} SGT. Refreshed about every five minutes.</p>
    </> : <p role="status" className="text-sm text-muted-foreground">{failed ? 'Usage metrics are temporarily unavailable. Please try again later.' : 'Loading usage metrics…'}</p>}
  </section>
}
