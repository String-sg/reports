import { mkdir, realpath, stat, writeFile, readFile, rename, open, unlink } from 'node:fs/promises'
import path from 'node:path'
export async function privateDirectory(directory: string) {
 if(!path.isAbsolute(directory)) throw new Error('Private state must use an absolute path')
 await mkdir(directory,{recursive:true,mode:0o700}); const resolved=await realpath(directory)
 let current=resolved
 while(true){try{await stat(path.join(current,'.git'));throw new Error('Private state cannot be inside Git')}catch(e){if((e as NodeJS.ErrnoException).code!=='ENOENT')throw e}const parent=path.dirname(current);if(parent===current)break;current=parent}
 await import('node:fs/promises').then(fs=>fs.chmod(resolved,0o700));return resolved
}
export async function atomicJson(file: string, value: unknown) {
 const temporary=`${file}.${process.pid}.tmp`;await writeFile(temporary,JSON.stringify(value,null,2)+'\n',{mode:0o600});await rename(temporary,file)
}
export async function readJson<T>(file:string):Promise<T|null>{try{return JSON.parse(await readFile(file,'utf8')) as T}catch(e){if((e as NodeJS.ErrnoException).code==='ENOENT')return null;throw e}}
export async function withLock<T>(dir:string,run:()=>Promise<T>):Promise<T>{
 const lock=path.join(dir,'run.lock')
 let handle
 try{handle=await open(lock,'wx',0o600)}catch(error){
  if((error as NodeJS.ErrnoException).code!=='EEXIST')throw error
  const recoveryPath=path.join(dir,'recovery.lock')
  const recovery=await open(recoveryPath,'wx',0o600)
  try{
  const before=await stat(lock),pid=Number(await readFile(lock,'utf8'))
  if(!Number.isSafeInteger(pid)||pid<1)throw error
  try{process.kill(pid,0);throw error}catch(check){if((check as NodeJS.ErrnoException).code!=='ESRCH')throw check}
  const after=await stat(lock);if(after.ino!==before.ino)throw error
  await unlink(lock);handle=await open(lock,'wx',0o600)
  }finally{await recovery.close();await unlink(recoveryPath)}
 }
 try{await handle.writeFile(String(process.pid));return await run()}finally{await handle.close();await unlink(lock)}
}
