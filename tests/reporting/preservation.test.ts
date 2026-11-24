import {test} from 'node:test'
import assert from 'node:assert/strict'
import {execFileSync} from 'node:child_process'
import vm from 'node:vm'
import ts from 'typescript'
import {PROJECTS,AGGREGATE} from '../../lib/data'
import {homeImpact} from '../../lib/reporting/home-impact'
test('historical inputs and unrelated product figures are preserved',()=>{
 const source=execFileSync('git',['show','e0c8fae13d9d5aa22d81a433d87760693751282b:lib/data.ts'],{encoding:'utf8'})
 const code=ts.transpile(source,{module:ts.ModuleKind.CommonJS})
 const exports:Record<string,unknown>={};vm.runInNewContext(code,{exports})
 const strip=(data:unknown)=>JSON.parse(JSON.stringify(data, (key,value)=>key==='periodId'?undefined:value))
 const oldProjects=exports.PROJECTS as typeof PROJECTS
 const unchangedProducts = (projects: typeof PROJECTS) => projects.filter(p => !['events', 'primary-2-shapes-adventure', 'seating', 'pathways'].includes(p.slug)).map(p => {
   if (p.slug === 'diagrams') {
     const { highlightStat, metrics, description, tagline, ...unchanged } = p
     return unchanged
   }
   if (p.slug === 'chergpt' || p.slug === 'remarkscopilot') {
     const { teacherImpact, description, tagline, ...unchanged } = p
     if (p.slug === 'chergpt') delete (unchanged as Partial<typeof p>).since
     const alternative = p.alternative ? { ...p.alternative, description: undefined } : undefined
     return { ...unchanged, ...(alternative ? { alternative } : {}), metrics: p.metrics.filter(metric => metric.label !== 'Total users' && metric.label !== 'Forks') }
   }
   if (p.slug === 'bingo') { const { contributors, tagline, ...unchanged } = p; return unchanged }
   return p
 })
 assert.deepEqual(strip(unchangedProducts(PROJECTS)),strip(unchangedProducts(oldProjects)))
 assert.equal(PROJECTS.find(p=>p.slug==='events')?.teacherImpact,527)
 const { totalUsers, totalProjects: oldTotalProjects, ...oldAggregate } = exports.AGGREGATE as typeof AGGREGATE & { totalUsers: string }
 const { totalProjects, ...currentAggregate } = AGGREGATE
 assert.deepEqual(strip(currentAggregate),strip(oldAggregate))
 assert.equal(totalProjects, PROJECTS.filter(p => p.status !== 'Deprecated').length)
 assert.equal(PROJECTS.find(p => p.slug === 'diagrams')?.teacherImpact, 187)
 assert.equal(PROJECTS.find(p => p.slug === 'remarkscopilot')?.metrics.find(m => m.label === 'Total users')?.value, '1,883')
 assert.equal(PROJECTS.find(p => p.slug === 'chergpt')?.metrics.find(m => m.label === 'Total users')?.value, '1,000+')
 assert.equal(homeImpact.find(stat => stat.label === 'Cumulative reach')?.value, '3,863+')
})
