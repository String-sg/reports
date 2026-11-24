import { ExternalLink, TriangleAlert } from 'lucide-react'
import { ReportPanel } from '@/components/report-panel'
import type { Alternative } from '@/lib/data'

interface DeprecatedAlternativeProps {
  alternative: Alternative
}

export function DeprecatedAlternative({ alternative }: DeprecatedAlternativeProps) {
  return (
    <ReportPanel className="report-deprecated">
      <h2><TriangleAlert size={17} aria-hidden="true" /> This product is deprecated</h2>
      <p>{alternative.description}</p>
      <div>
        <a className="report-detail-link" href={alternative.url} target="_blank" rel="noopener noreferrer">
          Try {alternative.name} <ExternalLink size={14} aria-hidden="true" />
        </a>
        {alternative.learnMoreUrl && (
          <a className="report-detail-link" href={alternative.learnMoreUrl} target="_blank" rel="noopener noreferrer">
            Learn more <ExternalLink size={14} aria-hidden="true" />
          </a>
        )}
      </div>
    </ReportPanel>
  )
}
