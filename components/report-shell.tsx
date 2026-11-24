import Link from 'next/link'
import { AppHeader, Brand } from '@string-sg/ui'

export function ReportHeader({ theme = 'dark' }: { theme?: 'light' | 'dark' }) {
  return <AppHeader theme={theme} brand={<Link href="/"><Brand product="Reports" logoSrc={`/brand/primary_${theme === 'light' ? 'dark' : 'white'}.svg`} /></Link>}>
    <nav aria-label="Main navigation" className="flex">
      <a href="https://id.string.sg/directory" target="_blank" rel="noopener noreferrer">Community</a>
      <a href="https://skills.string.sg" target="_blank" rel="noopener noreferrer">Skills</a>
      <a href="https://join.string.sg" target="_blank" rel="noopener noreferrer" className="sui-nav-action">Join String</a>
    </nav>
  </AppHeader>
}
