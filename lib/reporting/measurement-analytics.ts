const productionHost = 'reports.string.sg'
const productionOrigin = `https://${productionHost}`
const consentKey = 'string_reports_analytics_consent_v1'
const consentChange = 'string-reports-analytics-consent'
let lastPageLocation: string | null = null

declare global {
  interface Window {
    stringReportsAnalytics?: IArguments[]
    [disableFlag: `ga-disable-${string}`]: boolean | undefined
  }
}

function configuredId() {
  const id = process.env.NEXT_PUBLIC_REPORTS_GA_MEASUREMENT_ID
  if (typeof window === 'undefined' || window.location.hostname !== productionHost) return null

  const browser = window.navigator as Navigator & { globalPrivacyControl?: boolean }
  if (browser.globalPrivacyControl || browser.doNotTrack === '1') return null

  return id && /^G-[A-Z0-9]{8,}$/.test(id) ? id : null
}

export function getReportsAnalyticsPreference(): boolean | null {
  if (!configuredId()) return null

  try {
    return window.localStorage.getItem(consentKey) === 'granted'
  } catch {
    return null
  }
}

export function subscribeToReportsAnalyticsPreference(listener: () => void) {
  function syncStorage(event: StorageEvent) {
    if (event.key === consentKey || event.key === null) listener()
  }

  window.addEventListener(consentChange, listener)
  window.addEventListener('storage', syncStorage)
  return () => {
    window.removeEventListener(consentChange, listener)
    window.removeEventListener('storage', syncStorage)
  }
}

export function setReportsAnalyticsPreference(allowed: boolean) {
  const id = configuredId()
  if (!id) return null

  const browser = window
  browser[`ga-disable-${id}`] = !allowed
  try {
    if (allowed) {
      browser.localStorage.setItem(consentKey, 'granted')
    } else {
      browser.localStorage.removeItem(consentKey)
    }
  } catch {
    browser[`ga-disable-${id}`] = true
    return null
  }

  browser.dispatchEvent(new Event(consentChange))
  return allowed
}

function gtag(..._args: unknown[]) {
  window.stringReportsAnalytics?.push(arguments)
}

function startAnalytics(pageLocation: string) {
  const id = configuredId()
  if (!id || !getReportsAnalyticsPreference()) return null

  const browser = window
  const disableFlag = `ga-disable-${id}` as const
  if (browser[disableFlag]) return null

  if (!browser.stringReportsAnalytics) {
    browser.stringReportsAnalytics = []
    gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    })
    gtag('js', new Date())
    gtag('config', id, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_domain: productionHost,
      cookie_prefix: 'string_reports',
      page_location: pageLocation,
      page_title: 'String Reports',
      page_referrer: '',
    })

    const script = document.createElement('script')
    script.async = true
    script.referrerPolicy = 'no-referrer'
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}&l=stringReportsAnalytics`
    document.head.append(script)
    subscribeToReportsAnalyticsPreference(() => {
      browser[disableFlag] = getReportsAnalyticsPreference() !== true
    })
  }

  return id
}

export function trackReportsPageView(pathname: string | null) {
  // Only public app routes are supplied by the layout. Strip URL decorations defensively.
  const path = pathname?.split(/[?#]/, 1)[0]
  if (!path) {
    lastPageLocation = null
    return
  }

  const pageLocation = `${productionOrigin}${path}`
  if (lastPageLocation === pageLocation) return
  const id = startAnalytics(pageLocation)
  if (!id) {
    lastPageLocation = null
    return
  }

  gtag('event', 'page_view', {
    send_to: id,
    page_location: pageLocation,
    page_referrer: lastPageLocation ?? '',
    page_title: 'String Reports',
  })
  lastPageLocation = pageLocation
}

export function trackReportMeasurementOpen() {
  const id = startAnalytics(`${productionOrigin}/`)
  if (!id) return false

  trackReportsPageView('/')
  gtag('event', 'report_measurement_opened', {
    send_to: id,
    page_location: `${productionOrigin}/`,
    report: 'impact',
    metric: 'estimated_time_saved',
    source: 'homepage',
  })
  return true
}
