import {test} from 'node:test'
import assert from 'node:assert/strict'
import {mkdtemp,writeFile,rm,readFile} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import path from 'node:path'
import {snapshotFromExports,readSourceFile} from '../../scripts/reporting/collect'
import {privateDirectory,withLock,atomicJson} from '../../scripts/reporting/state'
import {candidateHolds} from '../../scripts/reporting/validate'
import {verifyDeployment,waitForDeployment} from '../../scripts/reporting/deployment'
const definitions=[{id:'product',product:'bingo',kind:'product' as const,actions:['game_saved']},{id:'events',product:'events',kind:'event' as const,actions:['attended']}]
const event=(sourceId:string,action:string,date:string)=>({key:'one',sourceId,action,occurredAt:date,person:{canonicalId:'member',verified:true}})
const policy={historyApproved:true,publicationEnabled:true,anomalyPolicyApproved:true}
test('quiet product stays current; attendance cutoff never truncates product history',()=>{
 const snapshot=snapshotFromExports([{sourceId:'product',checkedAt:'2026-10-25T00:00:00Z',dataThrough:'2026-10-25T00:00:00Z',frozen:false,facts:[event('product','game_saved','2026-10-01T00:00:00Z')]},{sourceId:'events',checkedAt:'2026-10-25T00:00:00Z',dataThrough:'2026-03-31T00:00:00Z',frozen:false,facts:[event('events','attended','2026-03-01T00:00:00Z')]}],definitions,'2026-10-25T00:00:00Z')
 assert.equal(snapshot.metrics.find(m=>m.scope==='ecosystem'&&m.periodId==='all'&&m.id==='product-users-unique')?.value,1)
 assert.equal(snapshot.metrics.find(m=>m.scope==='ecosystem'&&m.periodId==='all'&&m.id==='product-users-unique')?.dataThrough,'2026-10-25T00:00:00.000Z')
 assert.equal(snapshot.sources[0].checkedAt,'2026-10-25T00:00:00Z')
 const changed=structuredClone(snapshot);changed.metrics[0].value=100
 assert.ok(candidateHolds(policy,snapshot,[],changed).includes('headline_spike'))
 const reduced=structuredClone(snapshot);reduced.metrics[0].value=0
 assert.ok(candidateHolds(policy,snapshot,[],reduced).includes('cumulative_decrease'))
 const removed=structuredClone(snapshot);removed.metrics=[]
 assert.ok(candidateHolds(policy,snapshot,[],removed).includes('coverage_changed'))
})
test('static deployment digest must match, regardless of successful HTTP',async()=>{
 const respond=(revision:string)=>async()=>new Response(JSON.stringify({revision}),{status:200})
 await verifyDeployment('https://example.com','expected',respond('expected') as typeof fetch)
 await assert.rejects(verifyDeployment('https://example.com','expected',respond('old') as typeof fetch))
 await assert.rejects(verifyDeployment('http://example.com','expected',respond('expected') as typeof fetch))
})
test('private state permissions, exclusive locking and atomic writes',async()=>{
 const dir=await mkdtemp(path.join(tmpdir(),'string-report-test-'))
 try{await privateDirectory(dir);await withLock(dir,async()=>{await assert.rejects(withLock(dir,async()=>{}),{code:'EEXIST'});await atomicJson(path.join(dir,'status.json'),{ok:true})});assert.deepEqual(JSON.parse(await readFile(path.join(dir,'status.json'),'utf8')),{ok:true})}finally{await rm(dir,{recursive:true,force:true})}
})
test('source export refuses extra personal fields and inconsistent source IDs',async()=>{
 const dir=await mkdtemp(path.join(tmpdir(),'string-report-source-'))
 try{const file=path.join(dir,'product.json');await writeFile(file,JSON.stringify({sourceId:'product',checkedAt:'2026-10-25T00:00:00Z',dataThrough:'2026-10-25T00:00:00Z',facts:[],email:'do-not-publish@example.com'}));await assert.rejects(readSourceFile(dir,{...definitions[0],enabled:true}))}finally{await rm(dir,{recursive:true,force:true})}
})

test('deployment polling tolerates build delay and never accepts a persistent mismatch',async()=>{
 let requests=0
 const fetcher=(async()=>new Response(JSON.stringify({revision:++requests===3?'expected':'old'}))) as typeof fetch
 await waitForDeployment('https://example.com','expected',{fetcher,attempts:3,sleep:async()=>{}})
 assert.equal(requests,3)
 await assert.rejects(waitForDeployment('https://example.com','expected',{fetcher:(async()=>new Response('{"revision":"old"}')) as typeof fetch,attempts:2,sleep:async()=>{}}))
})
