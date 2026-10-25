import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { snapshotSchema } from '../../lib/reporting/schema'
import { snapshotRevision } from './publish'
async function main(){const snapshot=snapshotSchema.parse(JSON.parse(await readFile('data/reports.snapshot.json','utf8')));await mkdir('public',{recursive:true});await writeFile('public/reporting-revision.json',JSON.stringify({schemaVersion:1,revision:snapshotRevision(snapshot)})+'\n')}
main().catch(()=>{console.error('Reporting snapshot validation failed');process.exitCode=1})
