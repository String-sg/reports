export type UsageCounts = { visits: number; gamesStarted: number; gamesCompleted: number }
export type ShapesSummary = UsageCounts & {
  version: 1; periodDays: 30; generatedAt: string; firstEventAt: string | null;
  reportingTimezone: 'Asia/Singapore'; allTime: UsageCounts;
  monthly: (UsageCounts & { month: string })[];
}
const keys = ['visits', 'gamesStarted', 'gamesCompleted'] as const
function counts(value: unknown): value is UsageCounts {
  return !!value && typeof value === 'object' && keys.every(key => Number.isSafeInteger((value as UsageCounts)[key]) && (value as UsageCounts)[key] >= 0)
}
export function validShapesSummary(value: unknown): value is ShapesSummary {
  if (!value || typeof value !== 'object') return false
  const data = value as ShapesSummary
  if (data.version !== 1 || data.periodDays !== 30 || data.reportingTimezone !== 'Asia/Singapore' ||
    typeof data.generatedAt !== 'string' || !Number.isFinite(Date.parse(data.generatedAt)) ||
    !(data.firstEventAt === null || (typeof data.firstEventAt === 'string' && Number.isFinite(Date.parse(data.firstEventAt)))) ||
    !counts(data) || !counts(data.allTime) || !Array.isArray(data.monthly)) return false
  const totals = { visits: 0, gamesStarted: 0, gamesCompleted: 0 }
  let previous = ''
  for (const row of data.monthly) {
    if (!counts(row) || typeof row.month !== 'string' || !/^\d{4}-(0[1-9]|1[0-2])$/.test(row.month) || row.month <= previous) return false
    previous = row.month
    for (const key of keys) totals[key] += row[key]
  }
  return keys.every(key => totals[key] === data.allTime[key] && data[key] <= data.allTime[key]) &&
    (data.firstEventAt === null ? data.monthly.length === 0 : data.monthly.length > 0)
}
