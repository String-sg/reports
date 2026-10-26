'use client'
import { useEffect, useState } from 'react'
type Summary = { visits: number; gamesStarted: number; gamesCompleted: number; generatedAt: string }
export function ShapesMetrics() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/shapes-metrics', { signal: controller.signal })
      .then(async response => { if (!response.ok) throw new Error('unavailable'); return response.json() })
      .then(setSummary).catch(() => { if (!controller.signal.aborted) setFailed(true) })
    return () => controller.abort()
  }, [])
  return <section id="metrics" className="mb-12" aria-label="Shapes usage metrics">
    <h2 className="text-lg font-semibold text-foreground mb-5">Usage in the last 30 days</h2>
    <p className="text-sm text-muted-foreground mb-4">Opt-in activity counts, not unique pupils or learning outcomes. Names, classes, answers and scores are excluded. Declined analytics and blocked requests are not counted.</p>
    {summary ? <>
      <div className="grid sm:grid-cols-3 gap-4">
        {([['Visits', summary.visits], ['Games started', summary.gamesStarted], ['Games completed', summary.gamesCompleted]] as const).map(([label, value]) =>
          <div key={label} className="rounded-xl bg-card border border-border p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">{label}</p>
            <p className="text-3xl font-bold text-foreground">{value.toLocaleString()}</p>
          </div>)}
      </div>
      <p className="text-xs text-muted-foreground mt-3">Updated {new Date(summary.generatedAt).toLocaleString('en-SG', { timeZone: 'Asia/Singapore' })} SGT. Refreshed about every five minutes.</p>
    </> : <p role="status" className="text-sm text-muted-foreground">{failed ? 'Usage metrics are temporarily unavailable. Please try again later.' : 'Loading usage metrics…'}</p>}
  </section>
}
