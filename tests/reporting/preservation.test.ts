import {test} from 'node:test'
import assert from 'node:assert/strict'
import {execFileSync} from 'node:child_process'
import vm from 'node:vm'
import ts from 'typescript'
import {PROJECTS,AGGREGATE} from '../../lib/data'
test('non-event figures and legacy aggregate survive the authorised Luma reconciliation',()=>{
 const source=execFileSync('git',['show','e0c8fae13d9d5aa22d81a433d87760693751282b:lib/data.ts'],{encoding:'utf8'})
 const code=ts.transpile(source,{module:ts.ModuleKind.CommonJS})
 const exports:Record<string,unknown>={};vm.runInNewContext(code,{exports})
 const strip=(data:unknown)=>JSON.parse(JSON.stringify(data, (key,value)=>key==='periodId'?undefined:value))
 const oldProjects=exports.PROJECTS as typeof PROJECTS
 assert.deepEqual(strip(PROJECTS.filter(p=>p.slug!=='events')),strip(oldProjects.filter(p=>p.slug!=='events')))
 assert.equal(PROJECTS.find(p=>p.slug==='events')?.teacherImpact,527)
 assert.deepEqual(strip(AGGREGATE),strip(exports.AGGREGATE))
})
