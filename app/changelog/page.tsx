import type { Metadata } from 'next'
import Link from 'next/link'
import { ReportPanel } from '@/components/report-panel'
import { ReportHeading, ReportPage } from '@/components/report-shell'
import changes from '@/data/changelog.json'

export const metadata: Metadata = {
  title: 'Changelog | String Reports',
  description: 'Reporting changes and decisions across String products, programs and partnerships.',
}

const dateFormat = new Intl.DateTimeFormat('en-SG', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'Asia/Singapore',
})

export default function ChangelogPage() {
  return (
    <ReportPage className="report-detail">
      <Link className="back-link" href="/">← Back to reports</Link>
      <ReportHeading
        title="Changelog"
        description="Reporting changes and decisions. Dates reflect when changes were recorded."
      />
      <section aria-label="Reporting updates" className="report-changelog">
        <ReportPanel>
          {changes.map((change, index) => (
            <article className="change-entry" key={`${change.date}-${index}`}>
              <div className="change-meta">
                {change.date && (
                  <time dateTime={change.date}>{dateFormat.format(new Date(`${change.date}T12:00:00+08:00`))}</time>
                )}
                {change.planned && <span>Pending</span>}
              </div>
              <h2>{change.title}</h2>
              <p>{change.body}</p>
            </article>
          ))}
        </ReportPanel>
      </section>
    </ReportPage>
  )
}
