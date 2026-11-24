"use client"
import { useEffect, useMemo, useState } from 'react'

export function useReportingPeriod(ids: string[]) {
  const [period, setPeriod] = useState('all')
  const key = ids.join('|')
  const allowed = useMemo(() => [...new Set(['all', ...key.split('|').filter(Boolean)])], [key])
  useEffect(() => {
    const read = () => {
      const next = new URLSearchParams(window.location.search).get('period') ?? 'all'
      setPeriod(allowed.includes(next) ? next : 'all')
    }
    read()
    window.addEventListener('popstate', read)
    return () => window.removeEventListener('popstate', read)
  }, [allowed])
  const choose = (next: string) => {
    if (!allowed.includes(next)) return
    setPeriod(next)
    const url = new URL(window.location.href)
    if (next === 'all') url.searchParams.delete('period')
    else url.searchParams.set('period', next)
    window.history.replaceState(null, '', url)
  }
  return { period, allowed, choose }
}
