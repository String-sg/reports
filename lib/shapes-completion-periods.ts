const dayMs = 24 * 60 * 60 * 1_000
const singaporeDate = new Intl.DateTimeFormat('sv-SE', {
  year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Singapore',
})
const isoDate = (time: number) => new Date(time).toISOString().slice(0, 10)
export const singaporeCompletionDate = (timestamp: string) => singaporeDate.format(new Date(timestamp))

export type ShapesGrouping = 'day' | 'week'

export function groupShapesCompletions(
  days: ReadonlyArray<{ date: string; completedGames: number }>,
  firstDate: string,
  checkedAt: string,
  grouping: ShapesGrouping,
) {
  const counts = new Map(days.map(day => [day.date, day.completedGames]))
  const periods = []
  const through = Date.parse(singaporeCompletionDate(checkedAt))
  for (let start = Date.parse(firstDate); start <= through;) {
    const daysUntilSunday = (7 - new Date(start).getUTCDay()) % 7
    const end = grouping === 'week' ? Math.min(start + daysUntilSunday * dayMs, through) : start
    let completedGames = 0
    for (let day = start; day <= end; day += dayMs) {
      completedGames += counts.get(isoDate(day)) ?? 0
    }
    periods.push({ date: isoDate(start), through: isoDate(end), completedGames })
    start = end + dayMs
  }
  return periods
}
