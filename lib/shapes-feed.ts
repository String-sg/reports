import { validShapesSummary, type ShapesSummary } from './shapes-summary'

export async function fetchShapesSummary(): Promise<ShapesSummary | null> {
  try {
    const response = await fetch('https://primary-2-shapes-adventure.vercel.app/api/metrics?summary=history-v1', {
      next: { revalidate: 300 }, signal: AbortSignal.timeout(8000),
    })
    if (!response.ok) return null
    const data: unknown = await response.json()
    return validShapesSummary(data) ? data : null
  } catch {
    return null
  }
}
