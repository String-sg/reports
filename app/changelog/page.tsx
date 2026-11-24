import type { Metadata } from 'next'
import Link from 'next/link'
import { ReportHeader } from '@/components/report-shell'
import changes from '@/data/changelog.json'
import '../overview.css'

export const metadata: Metadata = { title: 'Changelog | String Reports', description: 'Reporting changes and decisions across String products, programs and partnerships.' }
export default function ChangelogPage() {
  return <div className="report-overview"><ReportHeader theme="light" /><main className="wrap changelog">
    <Link className="back-link" href="/">← Back to reports</Link><h1>Changelog</h1>
    <p className="change-intro">Reporting changes and decisions. Dates reflect when changes were recorded.</p>
    <section className="change-list" aria-label="Reporting updates">
      {changes.map((change, index) => <article className="change-entry" key={`${change.date}-${index}`}>
        <div className="change-meta">{change.date ? <time dateTime={change.date}>{new Date(`${change.date}T12:00:00+08:00`).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Singapore' })}</time> : <span className="change-period">Planned</span>}<span className="change-state">{change.planned ? 'Pending' : 'Update'}</span></div>
        <h2>{change.title}</h2><p>{change.body}</p>
      </article>)}
    </section>
    <nav className="report-links" aria-label="Reports pages"><Link href="/">Reports</Link></nav>
  </main></div>
}
