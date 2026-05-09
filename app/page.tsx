import { PROJECTS, AGGREGATE, type ProjectStatus } from "@/lib/data"
import { ProjectCard } from "@/components/project-card"
import Link from "next/link"

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

const ACTIVE_PROJECTS = SORTED_PROJECTS.filter((p) => p.status !== "Deprecated")
const PAST_PROJECTS = SORTED_PROJECTS.filter((p) => p.status === "Deprecated")
type Project = (typeof PROJECTS)[number]

const ProductGrid = ({ projects, className }: { projects: Project[]; className: string }) => (
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
      <header className="bg-[#33373B] border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
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

      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="mb-14">
          <h1 className="text-4xl font-bold text-foreground text-balance leading-tight mb-4">
            Metrics, updates<br />and learnings
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
            String is a volunteer-run edutech ecosystem. We share our product metrics openly
            to signal where energy is going, celebrate impact, and stay accountable to the
            educators we build for.
          </p>
        </div>

        {/* Aggregate stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-14 p-6 rounded-xl border border-border bg-card">
          <div>
            <p className="text-2xl font-bold text-foreground">{AGGREGATE.totalProjects}</p>
            <p className="text-xs text-muted-foreground mt-1">Active products</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{AGGREGATE.totalUsers}+</p>
            <p className="text-xs text-muted-foreground mt-1">Teachers reached</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{AGGREGATE.totalVolunteers}+</p>
            <p className="text-xs text-muted-foreground mt-1">Volunteer contributors</p>
          </div>
        </div>

        {/* Why we report */}
        <div className="grid md:grid-cols-3 gap-4 mb-14">
          {[
            {
              label: "Tackle problems",
              body: "Every product addresses a documented educator pain point. We build in the open to stay focused.",
            },
            {
              label: "Signal resource use",
              body: "Everyone here volunteers on top of their main jobs. These reports help us direct effort where it matters.",
            },
            {
              label: "Track impact",
              body: "We regularly share outcomes to ensure we're delivering real value to Singapore's education space.",
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
            <ProductGrid projects={PAST_PROJECTS} className="grid md:grid-cols-2 gap-4" />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between text-xs text-muted-foreground">
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
