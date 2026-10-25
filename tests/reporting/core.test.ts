import { test } from 'node:test'
import assert from 'node:assert/strict'
import { periodFor, periodsFor } from '../../lib/reporting/periods'
import { snapshotSchema } from '../../lib/reporting/schema'
import { aggregate } from '../../scripts/reporting/aggregate'
import { candidateHolds } from '../../scripts/reporting/validate'
import { digest } from '../../scripts/reporting/digest'

const sources = [{ id: 'one', product: 'bingo', actions: ['game_saved'], kind: 'product' as const }, { id: 'two', product: 'diagrams', actions: ['export'], kind: 'product' as const }, { id: 'events', product: 'events', actions: ['attended'], kind: 'event' as const }]
const fact = (key: string, sourceId: string, action: string, person: string | null, occurredAt = '2026-01-10T00:00:00Z') => ({ key, sourceId, action, occurredAt, person: person ? { canonicalId: person, verified: true } : null })
const facts = [fact('a1','one','game_saved','a'), fact('a2','two','export','a','2026-04-10T00:00:00Z'), fact('b1','one','game_saved','b'), fact('c1','events','attended','c'), fact('c2','events','attended','c'), fact('a3','events','attended','a')]

test('separate product and attendee unions; no sum of distinct quarters', () => {
 const result = aggregate(facts, sources, periodFor('all'))
 assert.deepEqual(result, { productUsers: 2, eventParticipants: 2, attendances: 3, anonymousActions: 0 })
 assert.equal(aggregate(facts,sources,periodFor('quarter:2026-Q1')).productUsers,2)
 assert.equal(aggregate(facts,sources,periodFor('quarter:2026-Q2')).productUsers,1)
})
test('registration/sign-in never count, even if a source misconfigures them', () => {
 assert.equal(aggregate([fact('r','one','sign_in','d'),fact('s','one','registration','e')],[{...sources[0],actions:['sign_in','registration']}],periodFor('all')).productUsers,0)
})
test('anonymous, unverified and repeated facts do not inflate unique people', () => {
 const unverified={...fact('u','one','game_saved','u'),person:{canonicalId:'u',verified:false}}
 const r=aggregate([...facts,facts[0],fact('x','two','export',null),unverified],sources,periodFor('all'))
 assert.equal(r.productUsers,2);assert.equal(r.anonymousActions,2)
})
test('unknown sources fail closed', () => {
 assert.throws(()=>aggregate([fact('x','unknown','export','a')],sources,periodFor('all')))
})
test('Singapore quarter boundaries and unavailable date ranges are deterministic', () => {
 const p=periodFor('quarter:2026-Q1')
 assert.equal(p.start,'2025-12-31T16:00:00.000Z');assert.equal(p.end,'2026-03-31T16:00:00.000Z')
 assert.throws(()=>periodFor('quarter:2026-Q5'))
 assert.deepEqual(periodsFor(['2026-04-01T00:00:00Z','2025-12-31T16:00:00Z']).map(p=>p.id),['all','year:2026','quarter:2026-Q2','quarter:2026-Q1'])
})
test('public snapshot is strict, identity-free and distinguishes unknown from zero', () => {
 const s={schemaVersion:1,definitionVersion:'1.0.0',generatedAt:'2026-10-25T00:00:00Z',sources:[],metrics:[]}
 assert.ok(snapshotSchema.safeParse(s).success)
 assert.equal(snapshotSchema.safeParse({...s,email:'private@example.com'}).success,false)
 assert.equal(snapshotSchema.safeParse({...s,sources:[{id:'one',dataThrough:null,checkedAt:null,status:'unavailable',email:'private@example.com'}]}).success,false)
})
test('historical approval, baseline and source failures hold publication', () => {
 assert.ok(candidateHolds({historyApproved:false,publicationEnabled:false,anomalyPolicyApproved:false},null,[]).includes('history_pending'))
 assert.ok(candidateHolds({historyApproved:true,publicationEnabled:true,anomalyPolicyApproved:true},null,[]).includes('baseline_pending'))
})
test('canonical digest ignores object key order but not changed counts', () => {
 assert.equal(digest({a:1,b:2}),digest({b:2,a:1}));assert.notEqual(digest({a:1}),digest({a:2}))
})
