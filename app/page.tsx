import Link from 'next/link'
import { ReportHeader } from '@/components/report-shell'
import { fetchShapesSummary } from '@/lib/shapes-feed'
import {
  teachingAdoption, estimatedHoursSaved, remarksGenerated, minutesSavedPerRemark,
  currentProductSlugs, pastProductSlugs, overviewProject, overviewCredits, productMetric,
  pastReachDisplay, productReach, cumulativeReach, reviewedEvents, eventReachGroups,
  partnerOrganisations, formatReach,
} from '@/lib/reporting/overview'
import './overview.css'

export const revalidate = 300

function ProductRow({ slug, completions }: { slug: string; completions?: number | null }) {
  const project = overviewProject(slug)
  let value = 'WIP', label = 'Metrics in progress', extra: string | undefined
  if (slug === 'primary-2-shapes-adventure') {
    value = completions == null ? '—' : completions.toLocaleString('en-SG')
    label = 'games completed'; extra = completions == null ? 'Metrics unavailable' : 'Tracked activity'
  } else if (slug === 'diagrams') {
    value = project.highlightStat.value; label = 'exporter browsers'; extra = `${productMetric(slug, 'PNG exports')} PNG exports`
  } else if (slug === 'remarkscopilot' || slug === 'chergpt') {
    value = productMetric(slug, 'Total users') ?? '—'; label = 'users'
    if (slug === 'chergpt') extra = `${productMetric(slug, 'Forks')} forks`
  }
  return <Link className="product" href={`/${slug}`} aria-label={project.name}>
    <div className="row-name"><div><p className="name">{slug === 'primary-2-shapes-adventure' ? 'P2 Shapes' : project.name}</p><p className="sub">{project.tagline}</p>{overviewCredits[slug] && <p className="credit">{overviewCredits[slug]}</p>}</div></div>
    <div className="result"><strong>{value}</strong><p className="sub">{label} ↗</p>{extra && <p className="extra">{extra}</p>}</div>
  </Link>
}
function PastReach() {
  return <details className="category legacy-reach"><summary><span>Past products</span><strong>{pastReachDisplay} users</strong></summary><div className="group-body">
    {pastProductSlugs.map(slug => <div className="contribution" key={slug}><div className="contribution-label"><span>{overviewProject(slug).name}</span><strong>{productMetric(slug, 'Total users')}</strong></div></div>)}
  </div></details>
}
export default async function ReportsIndexPage() {
  const shapes = await fetchShapesSummary()
  return <div className="report-overview">
    <ReportHeader theme="light" />
    <main className="wrap">
      <h1 className="sr-only">String Reports</h1>
      <div className="period-bar" aria-label="Reporting period"><span className="period">All time</span></div>
      <section className="outcomes" aria-label="All-time outcomes">
        <article className="outcome north-star" aria-labelledby="north-star-heading">
          <p className="eyebrow"><span className="star" aria-hidden="true">✳</span> North Star · Teaching &amp; learning</p>
          <h2 id="north-star-heading">Educators applying String products or concepts in teaching</h2>
          <div className="status"><p className="status-value">{formatReach(teachingAdoption.value)}</p><p className="status-copy">educators<span>{teachingAdoption.label}</span></p></div>
        </article>
        <article className="outcome savings" aria-labelledby="savings-heading">
          <p className="eyebrow">Estimated workload reduction</p><h2 id="savings-heading">{estimatedHoursSaved.toLocaleString('en-SG')}</h2>
          <p className="unit">Educator hours saved</p><p className="sub">Remarks Co-Pilot · all time</p>
          <details className="method"><summary>How we estimate this</summary><p>{remarksGenerated.toLocaleString('en-SG')} remarks generated × {minutesSavedPerRemark} minutes ÷ 60, rounded.<br />Assumes two minutes saved per generation. Actual use is unknown.</p></details>
        </article>
      </section>
      <div className="content">
        <div className="report-sections">
          <section className="panel" aria-labelledby="products-heading">
            <div className="panel-head"><h2 id="products-heading">Products</h2><span>2026</span></div>
            {currentProductSlugs.map(slug => <ProductRow key={slug} slug={slug} completions={shapes?.allTime.gamesCompleted} />)}
            <details className="legacy-products"><summary><span>Past products</span><strong>{pastReachDisplay}<span>users</span></strong></summary>{pastProductSlugs.map(slug => <ProductRow key={slug} slug={slug} />)}</details>
          </section>
          <section className="panel" aria-labelledby="programs-heading"><div className="panel-head"><h2 id="programs-heading">Programs</h2><span>Community learning</span></div>
            <Link className="product" href="/events"><div><p className="name">Events</p><p className="sub">{reviewedEvents.events.length} community sessions</p></div><div className="result"><strong>{formatReach(reviewedEvents.participation, reviewedEvents.estimated)}</strong><p className="sub">participation ↗</p></div></Link>
          </section>
          <section className="panel" aria-labelledby="partners-heading"><div className="panel-head"><h2 id="partners-heading">Partnerships</h2></div><div className="product"><div><p className="name">Supporting organisations</p><p className="sub">Venue sponsorship and programme support</p></div><div className="result"><strong>{formatReach(partnerOrganisations.length)}</strong><p className="sub">organisations</p></div></div></section>
        </div>
        <aside className="panel breakdown" aria-labelledby="reach-heading">
          <h2 id="reach-heading">Reach &amp; support</h2><p className="support-note">{formatReach(cumulativeReach)} cumulative reach</p>
          <details className="reach-group"><summary><span>Products</span><strong>{formatReach(productReach)}</strong></summary><div className="group-body"><PastReach /><div className="contribution"><div className="contribution-label"><span>Diagrams · historical</span><strong>{overviewProject('diagrams').teacherImpact}</strong></div></div></div></details>
          <details className="reach-group"><summary><span>Programs</span><strong>{formatReach(reviewedEvents.participation, reviewedEvents.estimated)}</strong></summary><div className="group-body">
            {eventReachGroups.map(group => <details className="category" key={group.name}><summary><span>{group.name}</span><strong>{formatReach(group.participation, group.estimated)}</strong></summary><ul className="event-links">{group.eventIds.map(id => {
              const event = reviewedEvents.events.find(event => event.id === id)!
              return <li key={id}><a href={event.url} target="_blank" rel="noopener noreferrer">{event.title}</a></li>
            })}</ul></details>)}
          </div></details>
          <details className="reach-group"><summary><span>Partnerships</span><strong>{formatReach(partnerOrganisations.length)}</strong></summary><div className="group-body"><p className="sub">Venue sponsorship and programme support</p><ul className="partner-list">{partnerOrganisations.map(name => <li key={name}>{name}</li>)}</ul></div></details>
        </aside>
      </div>
      <nav className="report-links" aria-label="Reports pages"><Link href="/changelog">Changelog</Link></nav>
    </main>
  </div>
}
