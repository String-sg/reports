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
 const unchangedProducts = (projects: typeof PROJECTS) => projects.filter(p => p.slug !== 'events').map(p => {
   if (p.slug === 'diagrams') {
     const { highlightStat, metrics, ...unchanged } = p
     return unchanged
   }
   if (p.slug === 'chergpt' || p.slug === 'remarkscopilot') {
     const { teacherImpact, ...unchanged } = p
     return { ...unchanged, metrics: p.metrics.filter(metric => metric.label !== 'Total users') }
   }
   return p
 })
 assert.deepEqual(strip(unchangedProducts(PROJECTS)),strip(unchangedProducts(oldProjects)))
 assert.equal(PROJECTS.find(p=>p.slug==='events')?.teacherImpact,527)
 const { totalUsers, ...oldAggregate } = exports.AGGREGATE as typeof AGGREGATE & { totalUsers: string }
 assert.deepEqual(strip(AGGREGATE),strip(oldAggregate))
 assert.equal(PROJECTS.find(p => p.slug === 'diagrams')?.teacherImpact, 187)
 assert.equal(PROJECTS.find(p => p.slug === 'remarkscopilot')?.metrics.find(m => m.label === 'Total users')?.value, '1,883')
 assert.equal(PROJECTS.find(p => p.slug === 'chergpt')?.metrics.find(m => m.label === 'Total users')?.value, '1,000+')
 assert.equal(homeImpact.find(stat => stat.label === 'Cumulative reported reach')?.value, '3,847+')
})
