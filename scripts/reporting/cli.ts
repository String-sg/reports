import { readFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { z } from 'zod'
import { snapshotSchema, type ReportSnapshot } from '../../lib/reporting/schema'
import { privateDirectory, withLock, atomicJson, readJson } from './state'
import { readSourceFile, snapshotFromExports } from './collect'
import { collectPostgres, queries } from './adapters/postgres'
import { candidateHolds } from './validate'
import { digest } from './digest'
import { publishSnapshot, snapshotRevision } from './publish'
import type { PublicationPolicy } from './types'
const sourceList=z.array(z.object({id:z.string().regex(/^[a-z][a-z0-9-]*$/),product:z.string().regex(/^[a-z][a-z0-9-]*$/),kind:z.enum(['product','event']),actions:z.array(z.string()),enabled:z.boolean(),adapter:z.enum(['file','postgres']).default('file'),reason:z.string().optional()}).strict())
const arg=(name:string)=>{const i=process.argv.indexOf(name);return i<0?null:process.argv[i+1]??null}
interface Candidate{snapshot:ReportSnapshot;revision:string;holds:string[];base:string;contextRevision:string}
async function main(){
 const command=process.argv[2]??'run',repo=process.cwd()
 const policy=z.object({historyApproved:z.boolean(),publicationEnabled:z.boolean(),anomalyPolicyApproved:z.boolean(),spikeAbsolute:z.number().nonnegative(),spikeRelative:z.number().nonnegative(),schedule:z.object({hour:z.literal(6),minute:z.literal(0),timezone:z.literal('Asia/Singapore')}).strict()}).strict().parse(JSON.parse(await readFile('config/reporting-policy.json','utf8')))
 const sources=sourceList.parse(JSON.parse(await readFile('config/reporting-sources.json','utf8'))).filter(s=>s.enabled)
 if(command==='run' && !sources.length){console.log(JSON.stringify({status:'held',reasons:['no_verified_sources','history_pending'],published:false}));process.exitCode=2;return}
 const configured=process.env.REPORTS_STATE_DIR;if(!configured)throw new Error('Private state directory required')
 const state=await privateDirectory(configured);await mkdir(path.join(state,'candidates'),{recursive:true,mode:0o700})
 const acceptedRaw=await readJson<ReportSnapshot>(path.join(state,'accepted.json'))
 const accepted=acceptedRaw?snapshotSchema.parse(acceptedRaw):null
 const acceptedContext=await readJson<{revision:string}>(path.join(state,'accepted-context.json'))
 const contextRevision=digest(sources.map(({id,kind,product,actions})=>({id,kind,product,actions})))
 if(command==='status'){console.log(JSON.stringify({acceptedRevision:accepted?snapshotRevision(accepted):null,lastRun:await readJson(path.join(state,'status.json'))}));return}
 await withLock(state,async()=>{
  if(command==='run'){
   const fileSources=sources.filter(s=>s.adapter==='file')
   if(fileSources.length && !process.env.REPORTS_SOURCE_DIR)throw new Error('Private source directory required')
   const sourceDir=process.env.REPORTS_SOURCE_DIR?await privateDirectory(process.env.REPORTS_SOURCE_DIR):null
   const bundles=await Promise.all(sources.map(s=>{if(s.adapter==='file')return readSourceFile(sourceDir!,s);if(!(s.id in queries))throw new Error('Unknown database adapter');return collectPostgres(s.id as keyof typeof queries)}))
   const snapshot=snapshotFromExports(bundles,sources,new Date().toISOString()),revision=snapshotRevision(snapshot)
   const base=(await import('node:child_process')).execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim()
   const holds=candidateHolds(policy,accepted,[],snapshot);if(acceptedContext?.revision!==contextRevision)holds.push('definition_context_changed')
   const candidate={snapshot,revision,base,contextRevision,holds}
   await atomicJson(path.join(state,'candidates',`${revision}.json`),candidate)
   await atomicJson(path.join(state,'status.json'),{revision,status:candidate.holds.length?'held':'validated',reasons:candidate.holds})
   if(process.argv.includes('--dry-run') || candidate.holds.length){console.log(JSON.stringify({status:candidate.holds.length?'held':'validated',revision,reasons:candidate.holds,published:false}));if(candidate.holds.length)process.exitCode=2;return}
   if(accepted && snapshotRevision(accepted)===revision){console.log(JSON.stringify({status:'unchanged',revision}));return}
   await publish(candidate)
  }else{
   const id=arg(command==='rollback'?'--revision':'--candidate');if(!id || !/^[a-f0-9]{64}$/.test(id))throw new Error('Candidate revision required')
   if(command==='rollback'){
    const previous=await readJson<ReportSnapshot>(path.join(state,'accepted',`${id}.json`));if(!previous)throw new Error('Unknown accepted revision')
    const snapshot=snapshotSchema.parse(previous),base=(await import('node:child_process')).execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim()
    await atomicJson(path.join(state,'candidates',`${id}.json`),{snapshot,revision:id,base,contextRevision,holds:['rollback_review_required']});await atomicJson(path.join(state,'review.json'),null);console.log(JSON.stringify({status:'held',revision:id,reasons:['rollback_review_required'],published:false}));process.exitCode=2;return
   }
   const candidate=await readJson<Candidate>(path.join(state,'candidates',`${id}.json`));if(!candidate || candidate.revision!==snapshotRevision(snapshotSchema.parse(candidate.snapshot)))throw new Error('Candidate digest mismatch')
   if(command==='accept'){
    if(arg('--digest')!==id || !policy.historyApproved || !policy.anomalyPolicyApproved)throw new Error('Review policy incomplete')
    if(candidate.contextRevision!==contextRevision)throw new Error('Source definitions changed');await atomicJson(path.join(state,'review.json'),{revision:id,contextRevision});console.log(JSON.stringify({status:'reviewed',revision:id,published:false}))
   }else if(command==='validate')console.log(JSON.stringify({revision:id,reasons:candidateHolds(policy,accepted,[],candidate.snapshot)}))
   else if(command==='publish')await publish(candidate)
   else throw new Error('Unknown reporting command')
  }
  async function publish(candidate:Candidate){
   const review=await readJson<{revision:string;contextRevision:string}>(path.join(state,'review.json'))
   const reasons=candidateHolds(policy,accepted,[],candidate.snapshot);if(candidate.contextRevision!==contextRevision)throw new Error('Source definition changed after candidate creation');if(acceptedContext?.revision!==contextRevision)reasons.push('definition_context_changed')
   const holds=reasons.filter(h=>!(review?.revision===candidate.revision && review.contextRevision===contextRevision && ['baseline_pending','headline_spike','cumulative_decrease','coverage_changed','definition_context_changed'].includes(h)))
   if(holds.length)throw new Error('Candidate is held')
   if(!process.env.REPORTS_DEPLOYMENT_URL)throw new Error('Deployment verification required')
   await publishSnapshot(repo,candidate.snapshot,process.env.REPORTS_DEPLOYMENT_URL,candidate.base)
   await mkdir(path.join(state,'accepted'),{recursive:true,mode:0o700})
   if(accepted)await atomicJson(path.join(state,'accepted',`${snapshotRevision(accepted)}.json`),accepted)
   await atomicJson(path.join(state,'accepted',`${candidate.revision}.json`),candidate.snapshot)
   await atomicJson(path.join(state,'accepted-context.json'),{revision:contextRevision})
   await atomicJson(path.join(state,'accepted.json'),candidate.snapshot)
   await atomicJson(path.join(state,'status.json'),{status:'deployed',revision:candidate.revision})
   console.log(JSON.stringify({status:'deployed',revision:candidate.revision}))
  }
 }).catch(async(error)=>{
  if((error as NodeJS.ErrnoException).code==='EEXIST'){console.log(JSON.stringify({status:'busy',published:false}));return}
  await atomicJson(path.join(state,'status.json'),{status:'failed',reason:'operation_failed',checkedAt:new Date().toISOString()})
  throw error
 })
}
main().catch(()=>{console.error(JSON.stringify({status:'failed',reason:'Reporting operation failed; verify local configuration, permissions and source contract. No candidate was accepted.'}));process.exitCode=1})
