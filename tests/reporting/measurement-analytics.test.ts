import assert from 'node:assert/strict'
import test from 'node:test'
import {
  getReportsAnalyticsPreference,
  setReportsAnalyticsPreference,
  trackReportMeasurementOpen,
  trackReportsPageView,
} from '../../lib/reporting/measurement-analytics'

test('Reports shares deduplicated pathname page views and measurement opens after consent', () => {
  const id = 'G-TEST000001'
  const originalId = process.env.NEXT_PUBLIC_REPORTS_GA_MEASUREMENT_ID
  const scripts: { src: string }[] = []
  const preferences = new Map<string, string>()
  const browser = {
    location: { hostname: 'reports.string.sg' },
    navigator: { globalPrivacyControl: false, doNotTrack: '' },
    localStorage: {
      getItem: (key: string) => preferences.get(key),
      setItem: (key: string, value: string) => preferences.set(key, value),
      removeItem: (key: string) => preferences.delete(key),
    },
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
    stringReportsAnalytics: undefined as IArguments[] | undefined,
  }
  Object.assign(globalThis, {
    window: browser,
    document: {
      head: { append: (script: { src: string }) => scripts.push(script) },
      createElement: () => ({}),
    },
  })

  try {
    delete process.env.NEXT_PUBLIC_REPORTS_GA_MEASUREMENT_ID
    assert.equal(getReportsAnalyticsPreference(), null)
    trackReportsPageView('/')
    trackReportMeasurementOpen()
    assert.equal(scripts.length, 0)

    process.env.NEXT_PUBLIC_REPORTS_GA_MEASUREMENT_ID = id
    assert.equal(getReportsAnalyticsPreference(), false)
    trackReportsPageView('/')
    trackReportMeasurementOpen()
    assert.equal(scripts.length, 0)

    assert.equal(setReportsAnalyticsPreference(true), true)
    assert.equal(scripts.length, 0)
    browser.location.hostname = 'reports-preview.vercel.app'
    trackReportsPageView('/')
    browser.location.hostname = 'reports.string.sg'
    browser.navigator.globalPrivacyControl = true
    trackReportMeasurementOpen()
    assert.equal(scripts.length, 0)

    browser.navigator.globalPrivacyControl = false
    trackReportsPageView('/diagrams')
    assert.equal(trackReportMeasurementOpen(), true)
    trackReportsPageView('/?ignored=example#heading')
    trackReportsPageView('/changelog?ignored=example#heading')
    trackReportsPageView('/changelog')
    trackReportsPageView('/')
    assert.equal(trackReportMeasurementOpen(), true)
    assert.equal(scripts.length, 1)
    assert.equal(new URL(scripts[0].src).hostname, 'www.googletagmanager.com')
    const commands = browser.stringReportsAnalytics?.map((command) => Array.from(command)) ?? []
    const config = commands.find(([command]) => command === 'config')?.[2]
    assert.equal(config.send_page_view, false)
    assert.equal(config.page_location, 'https://reports.string.sg/diagrams')
    assert.equal(config.page_referrer, '')
    const opening = ['event', 'report_measurement_opened', {
      send_to: id,
      page_location: 'https://reports.string.sg/',
      report: 'impact',
      metric: 'estimated_time_saved',
      source: 'homepage',
    }]
    function pageView(path: string, referrer: string) {
      return ['event', 'page_view', {
        send_to: id,
        page_location: `https://reports.string.sg${path}`,
        page_referrer: referrer,
        page_title: 'String Reports',
      }]
    }
    assert.deepEqual(commands.filter(([command]) => command === 'event'), [
      pageView('/diagrams', ''),
      pageView('/', 'https://reports.string.sg/diagrams'),
      opening,
      pageView('/changelog', 'https://reports.string.sg/'),
      pageView('/', 'https://reports.string.sg/changelog'),
      opening,
    ])

    assert.equal(setReportsAnalyticsPreference(false), false)
    trackReportsPageView('/changelog')
    assert.equal(trackReportMeasurementOpen(), false)
    assert.equal(browser.stringReportsAnalytics?.length, commands.length)
    assert.equal(Reflect.get(browser, `ga-disable-${id}`), true)
  } finally {
    if (originalId === undefined) {
      delete process.env.NEXT_PUBLIC_REPORTS_GA_MEASUREMENT_ID
    } else {
      process.env.NEXT_PUBLIC_REPORTS_GA_MEASUREMENT_ID = originalId
    }
    Reflect.deleteProperty(globalThis, 'window')
    Reflect.deleteProperty(globalThis, 'document')
  }
})
