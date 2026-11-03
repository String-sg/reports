import pg from 'pg'
import { z } from 'zod'
import { readFile } from 'node:fs/promises'
import { exportSchema } from '../collect'
const uuid=z.string().uuid()
const canonical=(id:unknown)=>id==null?null:{canonicalId:`string-id:${uuid.parse(id)}`,verified:true}
const mappingSchema=z.record(z.object({canonicalId:z.string().regex(/^string-id:[a-f0-9-]{36}$/i),verified:z.literal(true)}).strict())
export const queries={
 'string-id': "SELECT id, member_id, downloaded_at AS occurred_at FROM product_downloads WHERE product_slug = 'cca-splitter' AND downloaded_at <= $1 ORDER BY id LIMIT 100001",
 diagrams:'SELECT id, created_at AS occurred_at FROM events WHERE created_at <= $1 ORDER BY id LIMIT 100001',
 bingo:'SELECT g.id, u.google_id, g.created_at AS occurred_at FROM games g JOIN users u ON u.email = g.creator_email WHERE g.created_at <= $1 ORDER BY g.id LIMIT 100001',
} as const
const keys={'string-id':'REPORTS_STRING_ID_DATABASE_URL',diagrams:'REPORTS_DIAGRAMS_DATABASE_URL',bingo:'REPORTS_BINGO_DATABASE_URL'} as const
export async function collectPostgres(id:keyof typeof queries){
 const url=process.env[keys[id]];if(!url)throw new Error('Read-only source access missing')
 const connection=new URL(url);if(!['postgres:','postgresql:'].includes(connection.protocol))throw new Error('Invalid source protocol')
 const mapPath=process.env.REPORTS_IDENTITY_MAP
 const map=mapPath?mappingSchema.parse(JSON.parse(await readFile(mapPath,'utf8'))):{}
 const client=new pg.Client({connectionString:url,connectionTimeoutMillis:15000,query_timeout:20000})
 await client.connect()
 try{
  await client.query('BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY')
  await client.query("SET LOCAL statement_timeout = '15s'")
  const time=await client.query('SELECT transaction_timestamp() AS cutoff'),cutoff=(time.rows[0].cutoff as Date).toISOString()
  const result=await client.query(queries[id],[cutoff]);if(result.rows.length>100000)throw new Error('Source requires paginated onboarding')
  const facts=result.rows.map(row=>({key:String(row.id),sourceId:id,action:id==='string-id'?'download_completed':id==='bingo'?'game_saved':'export',occurredAt:(row.occurred_at as Date).toISOString(),person:id==='string-id'?canonical(row.member_id):id==='bingo'?(map[`google:${String(row.google_id)}`]??null):null}))
  await client.query('COMMIT')
  return exportSchema.parse({sourceId:id,checkedAt:cutoff,dataThrough:cutoff,frozen:false,facts})
 }finally{await client.end()}
}
