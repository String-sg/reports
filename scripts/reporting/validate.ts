import { isProductCount, snapshotSchema, type ReportSnapshot } from '../../lib/reporting/schema'
import type { PublicationPolicy } from './types'
export function candidateHolds(policy: PublicationPolicy, accepted: ReportSnapshot | null, failures: string[], next?: ReportSnapshot, committed?: ReportSnapshot): string[] {
 const holds: string[] = []
 if(!policy.historyApproved) holds.push('history_pending')
 if(!policy.publicationEnabled) holds.push('publication_disabled')
 if(!policy.anomalyPolicyApproved) holds.push('anomaly_policy_pending')
 if(!accepted) holds.push('baseline_pending')
 if(failures.length) holds.push('source_failed')
 if(next) snapshotSchema.parse(next)
 for (const previous of [accepted, committed]) {
   if (!previous || !next) continue
   if(previous.definitionVersion!==next.definitionVersion || JSON.stringify(previous.sources.map(s=>`${s.id}:${s.status}`).sort())!==JSON.stringify(next.sources.map(s=>`${s.id}:${s.status}`).sort())) holds.push('coverage_changed')
   if(previous.metrics.some(old=>!next.metrics.some(m=>m.id===old.id && m.scope===old.scope && m.periodId===old.periodId)))holds.push('coverage_changed')
   for(const metric of next.metrics.filter(m=>isProductCount(m.id) || (m.scope==='ecosystem' && m.periodId==='all' && m.id!=='anonymous-actions'))) {
     const old=previous.metrics.find(m=>m.id===metric.id && m.scope===metric.scope && m.periodId===metric.periodId)
     if(old && (old.coverage!==metric.coverage || JSON.stringify([...old.sourceIds].sort())!==JSON.stringify([...metric.sourceIds].sort())))holds.push('coverage_changed')
     if(old?.value==null || metric.value==null) continue
     if(metric.value<old.value) holds.push('cumulative_decrease')
     if(metric.value-old.value>Math.max(policy.spikeAbsolute??20,old.value*(policy.spikeRelative??0.2))) holds.push('headline_spike')
   }
 }
 return [...new Set(holds)]
}
