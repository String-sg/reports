export async function verifyDeployment(base:string,revision:string,fetcher:typeof fetch=fetch){
 const url=new URL('/reporting-revision.json',base)
 if(url.protocol!=='https:' || url.username || url.password || url.search)throw new Error('Invalid deployment URL')
 const response=await fetcher(url,{cache:'no-store',signal:AbortSignal.timeout(15000),redirect:'error'})
 if(!response.ok)throw new Error('Deployment unavailable')
 const data=await response.json() as {revision?:string}
 if(data.revision!==revision)throw new Error('Deployment revision mismatch')
}

// Allow the hosting build to finish; never advance acceptance on an HTTP-only success.
export async function waitForDeployment(base:string,revision:string,options:{attempts?:number;delayMs?:number;fetcher?:typeof fetch;sleep?:(ms:number)=>Promise<void>}={}){
 const {attempts=30,delayMs=10000,fetcher=fetch,sleep=(ms)=>new Promise<void>(resolve=>setTimeout(resolve,ms))}=options
 for(let attempt=0;attempt<attempts;attempt++){
  try{await verifyDeployment(base,revision,fetcher);return}catch{if(attempt===attempts-1)throw new Error('Deployment verification timed out')}
  await sleep(delayMs)
 }
 throw new Error('Deployment verification requires at least one attempt')
}
