'use client'
import { useEffect, useState } from 'react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { MetricCard } from '@/components/report-metric-layout'
import { ReportPanel, ReportPanelHeading } from '@/components/report-panel'
import type { ShapesSummary, UsageCounts } from '@/lib/shapes-summary'

const metrics = [['Visits', 'visits'], ['Games started', 'gamesStarted'], ['Games completed', 'gamesCompleted']] as const
function CountCards({ counts }: { counts: UsageCounts }) {
  return <div className="report-metric-grid">
    {metrics.map(([label, key]) => <MetricCard key={key} label={label} value={counts[key].toLocaleString()} />)}
  </div>
}
function monthLabel(month: string) {
  return new Date(`${month}-01T00:00:00Z`).toLocaleDateString('en-SG', { month: 'short', year: 'numeric', timeZone: 'Asia/Singapore' })
}

export function ShapesMetrics({ recordedCompletions, checkedAt }: {
  recordedCompletions: string | null
  checkedAt: string | null
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
  return (
    <section id="metrics" className="report-metric-stack" aria-label="Shapes usage metrics">
      <ReportPanel>
        <ReportPanelHeading>Completed games</ReportPanelHeading>
        <div className="report-metric-body">
          <p className="report-metric-value">{recordedCompletions ?? '—'}</p>
          <p className="report-metric-note">
            {recordedCompletions
              ? 'Completed game records and validated completion reports, counted once per game.'
              : 'Completed game records are unavailable.'}
          </p>
          {checkedAt && <p className="report-metric-note">
            Records checked <time dateTime={checkedAt}>{new Date(checkedAt).toLocaleDateString('en-SG', {
              timeZone: 'Asia/Singapore', day: 'numeric', month: 'short', year: 'numeric',
            })}</time>.
          </p>}
        </div>
      </ReportPanel>
      <ReportPanel>
        <ReportPanelHeading>Opt-in activity</ReportPanelHeading>
        <div className="report-metric-body report-metric-stack">
          <p className="report-metric-note">Opt-in activity counts, not unique pupils or learning outcomes. Names, classes, answers and scores are excluded. Declined analytics and blocked requests are not counted.</p>
          {summary ? <>
            <div aria-label="All-time totals" className="report-metric-group">
              <h3>All-time totals</h3>
              <p className="report-metric-note">{summary.firstEventAt ? `Since the first recorded event on ${new Date(summary.firstEventAt).toLocaleDateString('en-SG', { timeZone: 'Asia/Singapore', day: 'numeric', month: 'short', year: 'numeric' })}. Earlier usage was not tracked.` : 'No usage recorded yet.'}</p>
              <CountCards counts={summary.allTime} />
            </div>
            <div aria-label="Last 30 days" className="report-metric-group">
              <h3>Last 30 days</h3>
              <CountCards counts={summary} />
            </div>
            <div aria-label="Monthly trends" className="report-metric-group">
              <h3>Monthly trends</h3>
              <p className="report-metric-note">Calendar months in Singapore time. The latest month is partial. Zero-activity months are included from the first recorded event.</p>
              {summary.monthly.length ? <>
                <div className="report-metric-chart" aria-label="Monthly usage chart, latest 12 months">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={summary.monthly.slice(-12)} margin={{ top: 12, right: 12, bottom: 8, left: 0 }} accessibilityLayer>
                      <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" />
                      <XAxis dataKey="month" tickFormatter={monthLabel} stroke="var(--muted)" fontSize={11} interval="preserveStartEnd" />
                      <YAxis allowDecimals={false} stroke="var(--muted)" fontSize={11} width={46} />
                      <Tooltip labelFormatter={label => monthLabel(String(label))} contentStyle={{ background: 'var(--card)', borderColor: 'var(--line)', color: 'var(--ink)' }} />
                      <Legend />
                      <Line type="linear" dataKey="visits" name="Visits" stroke="var(--report-link)" strokeWidth={2} isAnimationActive={false} />
                      <Line type="linear" dataKey="gamesStarted" name="Games started" stroke="#176783" strokeWidth={2} strokeDasharray="6 3" isAnimationActive={false} />
                      <Line type="linear" dataKey="gamesCompleted" name="Games completed" stroke="#915220" strokeWidth={2} strokeDasharray="2 3" isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="report-metric-note">Chart: latest 12 months. Table: all recorded months.</p>
                <div className="report-metric-table" role="region" aria-label="Monthly activity table" tabIndex={0}>
                  <table aria-label="Monthly activity counts">
                    <thead><tr>{['Month', 'Visits', 'Started', 'Completed'].map(label => <th key={label} scope="col">{label}</th>)}</tr></thead>
                    <tbody>{[...summary.monthly].reverse().map((row, index) => <tr key={row.month}>
                      <th scope="row">{monthLabel(row.month)}{index === 0 ? ' (partial)' : ''}</th>
                      {metrics.map(([, key]) => <td key={key}>{row[key].toLocaleString()}</td>)}
                    </tr>)}</tbody>
                  </table>
                </div>
              </> : <p className="report-metric-note">Monthly trends will appear after the first recorded event.</p>}
            </div>
            <p className="report-metric-note">Updated {new Date(summary.generatedAt).toLocaleString('en-SG', { timeZone: 'Asia/Singapore' })} SGT. Refreshed about every five minutes.</p>
          </> : <p role="status" className="report-metric-note">{failed ? 'Usage metrics are temporarily unavailable. Please try again later.' : 'Loading usage metrics…'}</p>}
        </div>
      </ReportPanel>
    </section>
  )
}
