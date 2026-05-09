import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { type ProjectStatus } from "@/lib/data"

interface StatusBadgeProps {
  status: ProjectStatus
}

const STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; className: string }
> = {
  Building: {
    label: "Building",
    className:
      "bg-[#75F8CC]/15 text-[#75F8CC] border border-[#75F8CC]/30",
  },
  Prototype: {
    label: "Prototype",
    className:
      "bg-amber-400/15 text-amber-300 border border-amber-400/30",
  },
  Maintenance: {
    label: "Maintenance",
    className:
      "bg-[#C0F4FB]/15 text-[#C0F4FB] border border-[#C0F4FB]/30",
  },
  Deprecated: {
    label: "Deprecated",
    className:
      "bg-white/10 text-white/70 border border-white/15",
  },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  )
}

interface ContributorAvatarsProps {
  contributors: { name: string; initials: string; color: string; role: string }[]
  max?: number
}

export function ContributorAvatars({ contributors, max = 4 }: ContributorAvatarsProps) {
  const visible = contributors.slice(0, max)
  const overflow = contributors.length - max

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {visible.map((c) => (
          <div
            key={c.name}
            title={`${c.name} — ${c.role}`}
            className={`w-7 h-7 rounded-full ${c.color} flex items-center justify-center text-xs font-semibold text-white ring-2 ring-card select-none`}
            aria-label={`${c.name}, ${c.role}`}
          >
            {c.initials}
          </div>
        ))}
        {overflow > 0 && (
          <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground ring-2 ring-card">
            +{overflow}
          </div>
        )}
      </div>
      <span className="text-xs text-muted-foreground">
        {contributors.length} volunteer{contributors.length !== 1 ? "s" : ""}
      </span>
    </div>
  )
}

interface ProjectCardProps {
  slug: string
  name: string
  tagline: string
  status: ProjectStatus
  since: string
  audience: string[]
  contributors: { name: string; initials: string; color: string; role: string }[]
  volunteers?: number
  highlightStat: { value: string; label: string }
  url?: string
}

export function ProjectCard({
  slug,
  name,
  tagline,
  status,
  since,
  audience,
  contributors,
  volunteers,
  highlightStat,
  url,
}: ProjectCardProps) {
  return (
    <div className="group relative flex flex-col rounded-xl bg-card border border-border hover:border-primary/50 shadow-sm hover:shadow-md transition-all duration-200 p-6 hover:bg-card/80">
      {/* Invisible full-card link — captures clicks everywhere except Visit */}
      <Link
        href={`/${slug}`}
        className="absolute inset-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={name}
      />

      {/* Top: flex column so header grows and meta stays pinned above divider */}
      <div className="flex-1 flex flex-col">
        {/* Header: name + badge + tagline — absorbs variable height */}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h2 className="text-lg font-semibold text-foreground text-balance group-hover:text-primary transition-colors">
              {name}
            </h2>
            <StatusBadge status={status} />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {tagline}
          </p>
        </div>

        {/* Audience tags — always flush above Since row */}
        <div className="flex items-center gap-2 flex-wrap mt-4 mb-2">
          {audience.map((a) => (
            <span
              key={a}
              className="text-xs text-[#75F8CC]/80 bg-[#75F8CC]/10 px-2 py-0.5 rounded-full"
            >
              {a}
            </span>
          ))}
        </div>

        {/* Try it + Since — always directly above divider */}
        <div className="flex items-center gap-3 mt-3">
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 flex items-center gap-1 text-xs text-primary opacity-70 hover:opacity-100 transition-opacity"
            >
              <ExternalLink className="w-3 h-3" />
              Try it
            </a>
          )}
          {url && <span className="text-muted-foreground/40 text-xs">·</span>}
          <span className="text-xs text-muted-foreground">Since {since}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border mt-5 mb-4" />

      {/* Bottom: stat + contributors — always at same vertical position */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className={`text-2xl font-bold leading-none ${highlightStat.value === "WIP" ? "text-muted-foreground" : "text-primary"}`}>
            {highlightStat.value}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{highlightStat.label}</p>
        </div>
        <span className="text-xs text-muted-foreground shrink-0">
          {volunteers ?? contributors.length} volunteer{(volunteers ?? contributors.length) !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  )
}
