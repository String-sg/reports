export async function GET() {
  try {
    const response = await fetch('https://primary-2-shapes-adventure.vercel.app/api/metrics', {
      next: { revalidate: 300 }, signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error('upstream_unavailable');
    const data = await response.json();
    if (data.version !== 1 || data.periodDays !== 30 ||
      !['visits', 'gamesStarted', 'gamesCompleted'].every(key => Number.isSafeInteger(data[key]) && data[key] >= 0) ||
      typeof data.generatedAt !== 'string' || !Number.isFinite(Date.parse(data.generatedAt))) throw new Error('invalid_summary');
    return Response.json({ version: 1, periodDays: 30, generatedAt: data.generatedAt,
      visits: data.visits, gamesStarted: data.gamesStarted, gamesCompleted: data.gamesCompleted });
  } catch {
    return Response.json({ error: 'metrics_unavailable' }, { status: 503 });
  }
}
