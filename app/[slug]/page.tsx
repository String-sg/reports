import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { DeprecatedAlternative } from '@/components/deprecated-alternative'
import { EventReport } from '@/components/event-report'
import { StatusBadge } from '@/components/project-card'
import { ReportMetrics } from '@/components/report-metrics'
import { ReportPanel, ReportPanelHeading } from '@/components/report-panel'
import { ReportHeading, ReportPage } from '@/components/report-shell'
import { ShapesMetrics } from '@/components/shapes-metrics'
import { PROJECTS, shapesGamesCheckedAt, shapesGamesCompleted } from '@/lib/data'
import { publishedSnapshot } from '@/lib/reporting/selectors'

const metricLabels = Object.fromEntries(publishedSnapshot.definitions.map(({ id, label }) => [id, label]))

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const project = PROJECTS.find((project) => project.slug === slug)
  if (!project) return {}
  return {
    title: `${project.name} — String Reports`,
    description: project.tagline,
  }
}

export default async function ReportDetailPage({ params }: Props) {
  const { slug } = await params
  const project = PROJECTS.find((project) => project.slug === slug)
  if (!project) notFound()

  const isShapes = slug === 'primary-2-shapes-adventure'
  const snapshotMetrics = publishedSnapshot.metrics.filter((metric) => metric.scope === slug)
  const hasMetrics = project.metrics.length > 0 || snapshotMetrics.length > 0
  const sections = [
    { id: 'overview', label: 'Overview' },
    ...(isShapes || hasMetrics ? [{ id: 'metrics', label: 'Metrics' }] : []),
    ...(project.contributors.length ? [{ id: 'contributors', label: 'Contributors' }] : []),
    ...(project.updates.length ? [{ id: 'updates', label: 'Updates' }] : []),
  ]
  const updatesByDate = project.updates.reduce<Record<string, string[]>>((groups, update) => {
    const bodies = groups[update.date] ??= []
    bodies.push(update.body)
    return groups
  }, {})

  return (
    <ReportPage className="report-detail">
      <Link className="back-link" href="/">← Back to reports</Link>
      <ReportHeading title={project.name} description={project.description}>
        <div className="report-detail-meta">
          <span className="report-detail-status" data-status={project.status}>
            <StatusBadge status={project.status} />
          </span>
          <span>Since {project.since}</span>
          {project.url && (
            <a className="report-detail-link" href={project.url} target="_blank" rel="noopener noreferrer">
              {project.url.replace('https://', '')}
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          )}
        </div>
      </ReportHeading>

      {sections.length > 1 && (
        <nav className="report-detail-nav" aria-label="On this page">
          {sections.map(({ id, label }) => <a key={id} href={`#${id}`}>{label}</a>)}
        </nav>
      )}

      <div className="report-detail-stack">
        {project.status === 'Deprecated' && project.alternative && (
          <DeprecatedAlternative alternative={project.alternative} />
        )}

        <section id="overview" aria-labelledby="overview-heading">
          <ReportPanel>
            <ReportPanelHeading id="overview-heading">Overview</ReportPanelHeading>
            <dl className="report-detail-facts">
              <div><dt>Problem space</dt><dd>{project.problemSpace.join(', ')}</dd></div>
              <div><dt>Audience</dt><dd>{project.audience.join(', ')}</dd></div>
              {project.costPerQuarter && (
                <div><dt>Infrastructure</dt><dd>{project.costPerQuarter} / quarter</dd></div>
              )}
            </dl>
          </ReportPanel>
        </section>

        {isShapes && <ShapesMetrics recordedCompletions={shapesGamesCompleted} checkedAt={shapesGamesCheckedAt} />}
        {!isShapes && hasMetrics && (
          <div id="metrics">
            {slug === 'events'
              ? <EventReport />
              : <ReportMetrics metrics={project.metrics} snapshotMetrics={snapshotMetrics} labels={metricLabels} />}
          </div>
        )}

        {project.contributors.length > 0 && (
          <section id="contributors" aria-labelledby="contributors-heading">
            <ReportPanel>
              <ReportPanelHeading id="contributors-heading">Contributors</ReportPanelHeading>
              <ul className="report-detail-rows">
                {project.contributors.map((contributor) => (
                  <li key={contributor.name} className="report-contributor">
                    <span className="report-contributor-initials" style={{ backgroundColor: contributor.color }} aria-hidden="true">
                      {contributor.initials}
                    </span>
                    <div>
                      <p><strong>{contributor.name}</strong></p>
                      <p className="report-detail-note">{contributor.role}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </ReportPanel>
          </section>
        )}

        {project.updates.length > 0 && (
          <section id="updates" aria-labelledby="updates-heading">
            <ReportPanel>
              <ReportPanelHeading id="updates-heading">Updates</ReportPanelHeading>
              <ol className="report-detail-rows">
                {Object.entries(updatesByDate).map(([date, bodies]) => (
                  <li key={date} className="report-update">
                    <p><strong>{date}</strong></p>
                    <div>{bodies.map((body, index) => <p key={index}>{body}</p>)}</div>
                  </li>
                ))}
              </ol>
            </ReportPanel>
          </section>
        )}

        {project.status !== 'Deprecated' && (
          <ReportPanel className="report-help">
            <div>
              <h2>Help build {project.name}</h2>
              <p className="report-detail-note">Volunteer your skills to support educators.</p>
            </div>
            <a className="report-button" href="https://join.string.sg" target="_blank" rel="noopener noreferrer">
              Join String <ExternalLink size={14} aria-hidden="true" />
            </a>
          </ReportPanel>
        )}
      </div>
    </ReportPage>
  )
}
