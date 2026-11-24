import type { ReactNode } from 'react'
import { Select } from '@string-sg/ui/client'
import type { useReportingPeriod } from '@/hooks/use-reporting-period'
import { periodFor } from '@/lib/reporting/periods'

export function ReportingPeriodSelect({ period, allowed, choose }: ReturnType<typeof useReportingPeriod>) {
  return (
    <Select label="Reporting period" value={period} onChange={event => choose(event.target.value)}>
      {allowed.map(id => <option key={id} value={id}>{periodFor(id).label}</option>)}
    </Select>
  )
}

export function MetricCard({ label, value, children }: { label: string; value: string; children?: ReactNode }) {
  return (
    <div className="report-metric-card">
      <p className="report-metric-label">{label}</p>
      <p className="report-metric-value">{value}</p>
      {children}
    </div>
  )
}
