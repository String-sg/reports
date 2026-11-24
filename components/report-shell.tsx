import Link from 'next/link'
import type { ReactNode } from 'react'
import { AppHeader, Brand } from '@string-sg/ui'

export function ReportHeader({ theme = 'light' }: { theme?: 'light' | 'dark' }) {
  return <AppHeader theme={theme} brand={<Link href="/"><Brand product="Reports" logoSrc={`/brand/primary_${theme === 'light' ? 'dark' : 'white'}.svg`} /></Link>}>
    <nav aria-label="Main navigation" className="flex">
      <a href="https://id.string.sg/directory" target="_blank" rel="noopener noreferrer">Community</a>
      <a href="https://skills.string.sg" target="_blank" rel="noopener noreferrer">Skills</a>
      <a href="https://join.string.sg" target="_blank" rel="noopener noreferrer" className="sui-nav-action">Join String</a>
    </nav>
  </AppHeader>
}

export function ReportPage({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="report-overview">
      <ReportHeader />
      <main className={className ? `wrap report-main ${className}` : 'wrap report-main'}>
        {children}
      </main>
    </div>
  )
}

export function ReportHeading({ title, description, children }: {
  title: string
  description?: string
  children?: ReactNode
}) {
  return (
    <div className="report-heading">
      <h1>{title}</h1>
      {description && <p>{description}</p>}
      {children}
    </div>
  )
}
