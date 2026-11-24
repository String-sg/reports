import StringFooter from '@/components/string-footer/StringFooter'
import { ReportsAnalytics } from '@/components/reports-analytics'
import { PROJECTS } from '@/lib/data'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/next'
import '@string-sg/ui/styles.css'
import './globals.css'

const montserrat = localFont({
  src: [
    { path: './fonts/Montserrat-Regular.ttf', weight: '400', style: 'normal' },
    { path: './fonts/Montserrat-Medium.ttf', weight: '500', style: 'normal' },
    { path: './fonts/Montserrat-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: './fonts/Montserrat-Bold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-montserrat',
  display: 'swap',
})

const spaceGrotesk = localFont({
  src: [
    { path: './fonts/SpaceGrotesk-Regular.ttf', weight: '400', style: 'normal' },
    { path: './fonts/SpaceGrotesk-Medium.ttf', weight: '500', style: 'normal' },
    { path: './fonts/SpaceGrotesk-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: './fonts/SpaceGrotesk-Bold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://reports.string.sg'),
  title: 'String Reports',
  description: 'Reported educator adoption, estimated time savings, product usage and community programs across String.',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png',  media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        <ReportsAnalytics publicPaths={['/', '/changelog', ...PROJECTS.map(project => `/${project.slug}`)]} />
        <StringFooter />
        <Analytics />
      </body>
    </html>
  )
}
