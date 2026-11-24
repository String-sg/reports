import type { UsageCounts } from '@/lib/shapes-summary'
import { fetchShapesSummary } from '@/lib/shapes-feed'
const publicCounts = (counts: UsageCounts) => ({ visits: counts.visits, gamesStarted: counts.gamesStarted, gamesCompleted: counts.gamesCompleted })
export async function GET() {
  try {
    const data = await fetchShapesSummary();
    if (!data) throw new Error('metrics_unavailable');
    return Response.json({ version: 1, periodDays: 30, generatedAt: data.generatedAt,
      ...publicCounts(data), allTime: publicCounts(data.allTime), firstEventAt: data.firstEventAt,
      reportingTimezone: data.reportingTimezone,
      monthly: data.monthly.map(row => ({ month: row.month, ...publicCounts(row) })) });
  } catch {
    return Response.json({ error: 'metrics_unavailable' }, { status: 503 });
  }
}
