export interface ReportPeriod { id: string; label: string; start: string | null; end: string | null }
const boundary = (year: number, month: number) => new Date(Date.UTC(year, month, 1) - 8 * 3600_000).toISOString()
export function periodFor(id: string): ReportPeriod {
  if (id === 'all') return { id, label: 'All time', start: null, end: null }
  const year = /^year:(\d{4})$/.exec(id)
  if (year && +year[1] >= 2000 && +year[1] <= 2100) return { id, label: year[1], start: boundary(+year[1], 0), end: boundary(+year[1] + 1, 0) }
  const q = /^quarter:(\d{4})-Q([1-4])$/.exec(id)
  if (q && +q[1] >= 2000 && +q[1] <= 2100) return { id, label: `${q[1]} Q${q[2]}`, start: boundary(+q[1], (+q[2] - 1) * 3), end: boundary(+q[1], +q[2] * 3) }
  throw new Error('Invalid reporting period')
}
export function periodsFor(dates: string[]): ReportPeriod[] {
  const quarters = new Set<string>(); const years = new Set<number>()
  for (const date of dates) {
    const timestamp = Date.parse(date); if (!Number.isFinite(timestamp)) throw new Error('Invalid activity date')
    const d = new Date(timestamp + 8 * 3600_000), y = d.getUTCFullYear()
    years.add(y); quarters.add(`quarter:${y}-Q${Math.floor(d.getUTCMonth() / 3) + 1}`)
  }
  return [periodFor('all'), ...[...years].sort((a,b)=>b-a).flatMap(y => [periodFor(`year:${y}`), ...[...quarters].filter(q=>q.startsWith(`quarter:${y}-`)).sort().reverse().map(periodFor)])]
}
export function inPeriod(date: string, period: ReportPeriod) {
  const value = Date.parse(date)
  if (!Number.isFinite(value)) throw new Error('Invalid activity date')
  return (!period.start || value >= Date.parse(period.start)) && (!period.end || value < Date.parse(period.end))
}
