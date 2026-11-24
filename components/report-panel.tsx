import type { ReactNode } from 'react'

export function ReportPanel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className ? `panel ${className}` : 'panel'}>{children}</div>
}

export function ReportPanelHeading({ children, actions, id }: {
  children: ReactNode
  actions?: ReactNode
  id?: string
}) {
  return (
    <div className="panel-head report-panel-heading">
      <h2 id={id}>{children}</h2>
      {actions}
    </div>
  )
}
