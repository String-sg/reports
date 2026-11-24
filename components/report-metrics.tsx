'use client'
import { MetricCard, ReportingPeriodSelect } from '@/components/report-metric-layout'
import { ReportPanel, ReportPanelHeading } from '@/components/report-panel'
import { useReportingPeriod } from '@/hooks/use-reporting-period'
import type { Metric } from '@/lib/data'
import type { ReportSnapshot } from '@/lib/reporting/schema'

const sourceDate = new Intl.DateTimeFormat('en-SG', {
  day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Singapore',
})

export function ReportMetrics({ metrics, snapshotMetrics, labels }: {
  metrics: Metric[]
  snapshotMetrics: ReportSnapshot['metrics']
  labels: Record<string, string>
}) {
  const ids = [...new Set([...metrics.map(metric => metric.periodId), ...snapshotMetrics.map(metric => metric.periodId)]
    .filter((period): period is string => !!period && period !== 'all'))].sort().reverse()
  const selection = useReportingPeriod(ids)
  const { period } = selection
  const legacy = period === 'all' ? metrics : metrics.filter(metric => metric.periodId === period)
  const current = snapshotMetrics.filter(metric => metric.periodId === period)

  return (
    <ReportPanel>
      <ReportPanelHeading actions={<ReportingPeriodSelect {...selection} />}>Metrics</ReportPanelHeading>
      <div className="report-metric-body">
        <div aria-live="polite" className="report-metric-grid">
          {legacy.map(metric => (
            <MetricCard key={metric.label} label={metric.label} value={metric.value}>
              {metric.delta && <p className={metric.deltaPositive ? 'report-metric-positive' : 'report-metric-negative'}>{metric.delta}</p>}
              {metric.description && <p className="report-metric-note">{metric.description}</p>}
            </MetricCard>
          ))}
          {current.map(metric => {
            const note = [
              metric.coverage === 'partial' ? 'Covered sources only' : null,
              metric.dataThrough ? `Through ${sourceDate.format(new Date(metric.dataThrough))}` : null,
            ].filter(Boolean).join(' · ')
            return (
              <MetricCard key={metric.id} label={labels[metric.id]} value={metric.value == null ? '—' : metric.value.toLocaleString('en-SG')}>
                {note && <p className="report-metric-note">{note}</p>}
              </MetricCard>
            )
          })}
        </div>
      </div>
    </ReportPanel>
  )
}
