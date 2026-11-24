'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { CircleHelp, X } from 'lucide-react'
import { useRef } from 'react'
import { ReportsAnalyticsPreference } from '@/components/reports-analytics'
import { trackReportMeasurementOpen } from '@/lib/reporting/measurement-analytics'
import type { timeSavingsContributions } from '@/lib/reporting/overview'

const number = new Intl.NumberFormat('en-SG')
const contributionHours = new Intl.NumberFormat('en-SG', { maximumFractionDigits: 1 })

export function MeasurementDialog({
  contributions,
  minutes,
  hours,
}: {
  contributions: typeof timeSavingsContributions
  minutes: number
  hours: number
}) {
  const openingTracked = useRef(false)

  function trackOpening() {
    if (!openingTracked.current) openingTracked.current = trackReportMeasurementOpen()
  }

  return (
    <Dialog.Root onOpenChange={open => {
      if (open) trackOpening()
      else openingTracked.current = false
    }}>
      <Dialog.Trigger className="measurement-trigger">
        <CircleHelp size={16} aria-hidden="true" />
        How we measure this
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <Dialog.Content className="fixed inset-x-4 top-1/2 z-50 mx-auto max-h-[calc(100dvh-2rem)] max-w-lg -translate-y-1/2 overflow-y-auto rounded-xl bg-white p-5 text-string-dark shadow-lg sm:p-6">
          <Dialog.Title className="pr-11 text-xl font-bold">How we measure this</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm">
            We estimate time saved by comparing how long teachers report taking to complete comparable tasks with
            and without a String tool. We multiply the reported saving per action by the number of actions
            recorded for each product.
          </Dialog.Description>
          <Dialog.Close aria-label="Close" className="absolute right-2 top-2 grid size-11 cursor-pointer place-items-center rounded-md hover:bg-string-light focus-visible:outline-2 focus-visible:outline-offset-2">
            <X size={19} aria-hidden="true" />
          </Dialog.Close>
          <dl className="mt-4 divide-y divide-string-dark/15 border-y border-string-dark/15">
            {contributions.map(item => (
              <div className="py-3" key={item.product}>
                <dt className="text-sm font-semibold">{item.product}</dt>
                <dd className="mt-1 flex flex-wrap justify-between gap-x-3 gap-y-1 text-sm">
                  {item.count === null ? <span>Activity count unavailable</span> : (
                    <span>{number.format(item.count)} {item.activity} × {item.minutesPerAction} minutes</span>
                  )}
                  {item.minutes !== null && <span className="whitespace-nowrap font-semibold">≈ {contributionHours.format(item.minutes / 60)} hours</span>}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-sm">
            <strong>Estimated total · {number.format(hours)} educator hours</strong>
            {' '}from {number.format(minutes)} minutes, rounded to the nearest hour.
          </p>
          <p className="mt-2 text-sm">
            The calculation applies one rate per product. This is a best-effort estimate based on product
            telemetry where available, with surveys as a proxy where telemetry is unavailable.
          </p>
          <ReportsAnalyticsPreference onConsentGranted={trackOpening} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
