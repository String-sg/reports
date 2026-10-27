import { validShapesSummary, type UsageCounts } from '@/lib/shapes-summary'
const publicCounts = (counts: UsageCounts) => ({ visits: counts.visits, gamesStarted: counts.gamesStarted, gamesCompleted: counts.gamesCompleted })
export async function GET() {
  try {
    const response = await fetch('https://primary-2-shapes-adventure.vercel.app/api/metrics?summary=history-v1', {
      next: { revalidate: 300 }, signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error('upstream_unavailable');
    const data = await response.json();
    if (!validShapesSummary(data)) throw new Error('invalid_summary');
    return Response.json({ version: 1, periodDays: 30, generatedAt: data.generatedAt,
      ...publicCounts(data), allTime: publicCounts(data.allTime), firstEventAt: data.firstEventAt,
      reportingTimezone: data.reportingTimezone,
      monthly: data.monthly.map(row => ({ month: row.month, ...publicCounts(row) })) });
  } catch {
    return Response.json({ error: 'metrics_unavailable' }, { status: 503 });
  }
}
