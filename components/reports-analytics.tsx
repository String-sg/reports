'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useSyncExternalStore } from 'react'
import {
  getReportsAnalyticsPreference,
  setReportsAnalyticsPreference,
  subscribeToReportsAnalyticsPreference,
  trackReportsPageView,
} from '@/lib/reporting/measurement-analytics'

function useReportsAnalyticsPreference() {
  return useSyncExternalStore(
    subscribeToReportsAnalyticsPreference,
    getReportsAnalyticsPreference,
    () => null,
  )
}

export function ReportsAnalyticsPreference({ onConsentGranted }: { onConsentGranted?: () => void }) {
  const allowed = useReportsAnalyticsPreference()

  if (allowed === null) return null

  return (
    <label className="mt-4 flex items-start gap-2 text-sm">
      <input
        type="checkbox"
        className="mt-1"
        checked={allowed}
        onChange={(event) => {
          if (setReportsAnalyticsPreference(event.currentTarget.checked)) onConsentGranted?.()
        }}
      />
      <span>Share Reports page views and measurement dialog opens with Google Analytics (uses cookies).</span>
    </label>
  )
}

export function ReportsAnalytics({ publicPaths }: { publicPaths: string[] }) {
  const allowed = useReportsAnalyticsPreference()
  const pathname = usePathname()

  useEffect(() => {
    trackReportsPageView(publicPaths.includes(pathname) ? pathname : null)
  }, [allowed, pathname, publicPaths])

  if (allowed === null) return null

  return (
    <div className="mx-auto max-w-6xl px-6 pb-4">
      <ReportsAnalyticsPreference />
    </div>
  )
}
