import { ReportHeader } from '@/components/report-shell'
import { PROJECTS, type ProjectStatus } from "@/lib/data"
import { ProjectCard } from "@/components/project-card"
import { ImpactSummary } from "@/components/impact-summary"

const STATUS_ORDER: Record<ProjectStatus, number> = {
  Building: 0,
  Maintenance: 1,
  Prototype: 2,
  Deprecated: 3,
}

const SORTED_PROJECTS = [...PROJECTS].sort((a, b) => {
  const statusDiff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
  if (statusDiff !== 0) return statusDiff
  return Number(b.since) - Number(a.since)
})

type Project = (typeof PROJECTS)[number]
const ACTIVE_PROJECTS = SORTED_PROJECTS.filter((p) => p.status !== "Deprecated")
const PAST_PROJECTS = SORTED_PROJECTS.filter((p) => p.status === "Deprecated")

const ProductGrid = ({ projects, className = "" }: { projects: Project[]; className?: string }) => (
  <div className={className}>
    {projects.map((project) => (
      <ProjectCard key={project.slug} {...project} />
    ))}
  </div>
)

export default function ReportsIndexPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <ReportHeader />

      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="mb-14">
          <h1 className="text-4xl font-bold text-foreground text-balance leading-tight mb-4">
            String impact reports
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
            Product usage and community participation across String.
          </p>
        </div>

        <ImpactSummary />

        {/* Why we report */}
        <div className="grid md:grid-cols-3 gap-4 mb-14">
          {[
            {
              label: "Tackle problems",
              body: "Build tools around educators’ needs.",
            },
            {
              label: "Direct our effort",
              body: "Use evidence to guide volunteer time.",
            },
            {
              label: "Track impact",
              body: "Share usage, outcomes and lessons.",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl bg-card border border-border p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
                {item.label}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>

        {/* Section heading */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Products</h2>
        </div>

        {/* Active products */}
        <ProductGrid projects={ACTIVE_PROJECTS} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4" />

        {/* Past products */}
        {PAST_PROJECTS.length > 0 && (
          <>
            <h3 className="mt-12 text-base font-semibold text-muted-foreground mb-6">
              Past products
            </h3>
            <ProductGrid projects={PAST_PROJECTS} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4" />
          </>
        )}
      </main>

      {/* Footer */}
    </div>
  )
}
