import raw from '../../data/reports.snapshot.json'
import { snapshotSchema } from './schema'
export const publishedSnapshot=snapshotSchema.parse(raw)
export function reportMetric(id:string,scope='ecosystem',periodId='all') {return publishedSnapshot.metrics.find(m=>m.id===id && m.scope===scope && m.periodId===periodId)??null}
