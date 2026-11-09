import { homeImpact, homeImpactNote } from '@/lib/reporting/home-impact'
import { ReportSourceDates } from './report-source-dates'

export function ImpactSummary() {
  return (
    <div className="mb-14">
      <div className="grid grid-cols-2 gap-4 rounded-xl border border-border bg-card p-6 md:grid-cols-4">
        {homeImpact.map(({ value, label }) => (
          <div key={label}>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{homeImpactNote}</p>
      <ReportSourceDates />
    </div>
  )
}
