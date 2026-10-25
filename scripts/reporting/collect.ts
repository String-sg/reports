import { readFile, realpath, stat } from 'node:fs/promises'
import path from 'node:path'
import { z } from 'zod'
import { factSchema } from './types'
import type { SourceDefinition } from './types'
import { aggregate } from './aggregate'
import { periodFor, periodsFor } from '../../lib/reporting/periods'
import { snapshotSchema, type ReportSnapshot } from '../../lib/reporting/schema'
export const exportSchema=z.object({sourceId:z.string(),checkedAt:z.string().datetime(),dataThrough:z.string().datetime(),frozen:z.boolean().default(false),facts:z.array(factSchema)}).strict()
export interface EnabledSource extends SourceDefinition { enabled:boolean }
export async function readSourceFile(directory:string,source:EnabledSource){
 const base=await realpath(directory);const file=await realpath(path.join(base,`${source.id}.json`))
 if(!file.startsWith(base+path.sep))throw new Error('Source path escapes private directory')
 if((await stat(file)).size>50*1024*1024)throw new Error('Source export exceeds limit')
 const value=exportSchema.parse(JSON.parse(await readFile(file,'utf8')))
 if(value.sourceId!==source.id || value.facts.some(f=>f.sourceId!==source.id))throw new Error('Source identity mismatch')
 if(value.facts.some(f=>Date.parse(f.occurredAt)>Date.parse(value.dataThrough)))throw new Error('Fact after extraction cutoff')
 return value
}
export function snapshotFromExports(bundles:z.infer<typeof exportSchema>[],sources:SourceDefinition[],now:string):ReportSnapshot {
 const allFacts=bundles.flatMap(b=>b.facts),periods=periodsFor(allFacts.map(f=>f.occurredAt)),metrics:ReportSnapshot['metrics']=[]
 for(const scope of ['ecosystem',...new Set(sources.map(s=>s.product))]) {
   const definitions=scope==='ecosystem'?sources:sources.filter(s=>s.product===scope)
   for(const kind of ['product','event'] as const){
    const selectedSources=definitions.filter(s=>s.kind===kind),ids=selectedSources.map(s=>s.id);if(!ids.length)continue
    const selectedBundles=bundles.filter(b=>ids.includes(b.sourceId)),active=selectedBundles.filter(b=>!b.frozen)
    const cutoff=active.length?Math.min(...active.map(b=>Date.parse(b.dataThrough))):null
    const through=cutoff===null?(selectedBundles.length?new Date(Math.max(...selectedBundles.map(b=>Date.parse(b.dataThrough)))).toISOString():null):new Date(cutoff).toISOString()
    const facts=selectedBundles.flatMap(b=>b.facts.filter(f=>b.frozen || cutoff===null || Date.parse(f.occurredAt)<=cutoff))
    for(const period of periods){const totals=aggregate(facts,selectedSources,period)
     const pairs=kind==='product'?[['product-users-unique',totals.productUsers],['anonymous-actions',totals.anonymousActions]] as const:[['event-participants-unique',totals.eventParticipants],['event-attendances',totals.attendances]] as const
     for(const [id,value] of pairs)metrics.push({id,scope,periodId:period.id,value,coverage:'partial',sourceIds:ids,dataThrough:through})
    }
   }
 }
 return snapshotSchema.parse({schemaVersion:1,definitionVersion:'1.0.0',generatedAt:now,periods,sources:bundles.map(b=>({id:b.sourceId,checkedAt:b.checkedAt,dataThrough:b.dataThrough,status:b.frozen?'frozen':'active'})),metrics})
}
