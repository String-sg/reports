import { notFound } from "next/navigation"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { PROJECTS } from "@/lib/data"
import { StatusBadge, ContributorAvatars } from "@/components/project-card"
import { DeprecatedAlternative } from "@/components/deprecated-alternative"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const project = PROJECTS.find((p) => p.slug === slug)
  if (!project) return {}
  return {
    title: `${project.name} — String Reports`,
    description: project.tagline,
  }
}

export default async function ReportDetailPage({ params }: Props) {
  const { slug } = await params
  const project = PROJECTS.find((p) => p.slug === slug)
  if (!project) notFound()

  const sections = [
    { id: "overview", label: "Overview" },
    ...(project.metrics.length > 0 ? [{ id: "metrics", label: "Metrics" }] : []),
    ...(project.contributors.length > 0 ? [{ id: "contributors", label: "Contributors" }] : []),
    ...(project.updates.length > 0 ? [{ id: "updates", label: "Updates" }] : []),
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="bg-card border-b border-white/10">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-primary tracking-tight">
            Reports
          </Link>
          <a
            href="https://join.string.sg"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-primary hover:underline underline-offset-4"
          >
            Join String
          </a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-14">
        {/* Title block */}
        <div className="mb-10">
          <div className="flex items-start gap-4 justify-between mb-3 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold text-foreground text-balance">{project.name}</h1>
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-primary mt-1.5 hover:underline underline-offset-4"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {project.url.replace("https://", "")}
                </a>
              )}
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <StatusBadge status={project.status} />
              <span className="text-xs text-muted-foreground">
                Since {project.since} · Built for {project.audience.join(", ").toLowerCase()}
              </span>
            </div>
          </div>
          <p className="text-base text-muted-foreground leading-relaxed">{project.description}</p>
        </div>

        {/* Deprecated alternative banner */}
        {project.status === "Deprecated" && project.alternative && (
          <DeprecatedAlternative alternative={project.alternative} />
        )}

        {/* Nav anchors — only render when there's more than just Overview */}
        {sections.length > 1 && (
          <nav className="flex gap-6 border-b border-border pb-4 mb-10 text-sm font-medium">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {section.label}
              </a>
            ))}
          </nav>
        )}

        {/* Overview */}
        <section id="overview" className="mb-12">
          <h2 className="text-lg font-semibold text-foreground mb-4">Overview</h2>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
              Problem space: {project.problemSpace.join(", ")}
            </span>
            <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
              Audience: {project.audience.join(", ")}
            </span>
            {project.costPerQuarter && (
              <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                Infra: {project.costPerQuarter} / quarter
              </span>
            )}
          </div>
        </section>

        {/* Metrics */}
        {project.metrics.length > 0 && (
          <section id="metrics" className="mb-12">
            <h2 className="text-lg font-semibold text-foreground mb-5">Metrics</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-xl bg-card border border-border p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
                    {metric.label}
                  </p>
                  <p className="text-3xl font-bold text-foreground leading-none">{metric.value}</p>
                  {metric.delta && (
                    <p
                      className={`text-sm mt-2 font-medium ${
                        metric.deltaPositive ? "text-teal-400" : "text-rose-400"
                      }`}
                    >
                      {metric.delta}
                    </p>
                  )}
                  {metric.description && (
                    <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contributors */}
        {project.contributors.length > 0 && (
          <section id="contributors" className="mb-12">
            <h2 className="text-lg font-semibold text-foreground mb-5">Contributors</h2>
            <div className="rounded-xl bg-card border border-border divide-y divide-border">
              {project.contributors.map((c) => (
                <div key={c.name} className="flex items-center gap-4 px-5 py-4">
                  <div
                    className={`w-9 h-9 rounded-full ${c.color} flex items-center justify-center text-sm font-semibold text-white shrink-0 select-none`}
                    aria-hidden="true"
                  >
                    {c.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Updates — grouped by date period */}
        <section id="updates" className="mb-16">
          <h2 className="text-lg font-semibold text-foreground mb-5">Updates</h2>
          <ol className="relative border-l border-border ml-3 space-y-8">
            {Object.entries(
              project.updates.reduce<Record<string, string[]>>((acc, u) => {
                if (!acc[u.date]) acc[u.date] = []
                acc[u.date].push(u.body)
                return acc
              }, {})
            ).map(([date, bodies]) => (
              <li key={date} className="pl-6 relative">
                <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-primary" />
                <p className="text-xs font-semibold text-primary mb-2 uppercase tracking-wider">
                  {date}
                </p>
                <div className="space-y-1.5">
                  {bodies.map((body, i) => (
                    <p key={i} className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Join CTA — hidden for deprecated products */}
        {project.status !== "Deprecated" && (
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-8 text-center">
            <h3 className="text-xl font-bold text-foreground mb-2 text-balance">
              Help build {project.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed max-w-sm mx-auto">
              String runs entirely on volunteer effort. If you care about education and want to
              contribute — as an engineer, designer, or researcher — we'd love to have you.
            </p>
            <a
              href="https://join.string.sg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Join String
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-8">
        <div className="max-w-3xl mx-auto px-6 py-8 flex items-center justify-between text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} String</span>
          <a
            href="https://join.string.sg"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline underline-offset-4"
          >
            Want to contribute? Join String →
          </a>
        </div>
      </footer>
    </div>
  )
}
