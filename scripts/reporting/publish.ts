import { execFileSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { snapshotSchema, type ReportSnapshot } from '../../lib/reporting/schema'
import { atomicJson } from './state'
import { digest } from './digest'
import { waitForDeployment } from './deployment'
export const snapshotRevision=(snapshot:ReportSnapshot)=>{const {generatedAt,revision,...data}=snapshot;return digest(data)}
export async function publishSnapshot(repo:string,snapshot:ReportSnapshot,deployURL:string,expectedBase:string){
 const candidate=snapshotSchema.parse(snapshot)
 const git=(...args:string[])=>execFileSync('git',args,{cwd:repo,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim()
 if(git('status','--porcelain'))throw new Error('Publisher requires a clean dedicated checkout')
 git('fetch','origin')
 const existing=snapshotSchema.parse(JSON.parse(await readFile(path.join(repo,'data/reports.snapshot.json'),'utf8')))
 // A pushed commit may already exist when deployment verification was interrupted.
 if(snapshotRevision(existing)===snapshotRevision(candidate)){
  if(git('rev-parse','HEAD')!==git('rev-parse','@{upstream}'))throw new Error('Published checkout diverged')
  await waitForDeployment(deployURL,snapshotRevision(candidate));return
 }
 if(git('rev-parse','HEAD')!==expectedBase || git('rev-parse','@{upstream}')!==expectedBase)throw new Error('Publisher base changed')
 const target='data/reports.snapshot.json';const prior=await readFile(path.join(repo,target),'utf8')
 try{
  await atomicJson(path.join(repo,target),candidate)
  for(const script of ['test:reporting','typecheck','build'])execFileSync('npm',['run',script],{cwd:repo,stdio:'pipe',timeout:180000})
  git('add','--',target)
  const staged=git('diff','--cached','--name-only').split('\n').filter(Boolean)
  if(staged.length!==1 || staged[0]!==target)throw new Error('Publication file allowlist failed')
  git('commit','-m','data: refresh validated reporting snapshot');git('push','origin','HEAD')
 }catch(error){
  // Restore the working file only if no publication commit changed HEAD. Never reset app history.
  if(git('rev-parse','HEAD')===expectedBase){await import('node:fs/promises').then(fs=>fs.writeFile(path.join(repo,target),prior));git('restore','--staged','--',target)}
  throw error
 }
 await waitForDeployment(deployURL,snapshotRevision(candidate))
}
