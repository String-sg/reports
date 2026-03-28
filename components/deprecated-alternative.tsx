import { ExternalLink, TriangleAlert } from "lucide-react"
import { type Alternative } from "@/lib/data"

interface DeprecatedAlternativeProps {
  alternative: Alternative
}

export function DeprecatedAlternative({ alternative }: DeprecatedAlternativeProps) {
  return (
    <div className="rounded-xl border border-amber-700/40 bg-amber-950/20 p-5 mb-10">
      <div className="flex items-center gap-2 mb-2">
        <TriangleAlert className="w-4 h-4 text-amber-400 shrink-0" />
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
          This product is deprecated
        </p>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
        {alternative.description}
      </p>
      <a
        href={alternative.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-700/40 text-amber-300 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
      >
        Go to {alternative.name}
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  )
}
