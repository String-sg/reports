"use client"
import { useEffect, useMemo, useState } from 'react'
import { Select } from '@string-sg/ui/client'
import type { Metric } from '@/lib/data'
import { periodFor } from '@/lib/reporting/periods'
import type { ReportSnapshot } from '@/lib/reporting/schema'
export function ReportMetrics({metrics,snapshotMetrics}:{metrics:Metric[];snapshotMetrics:ReportSnapshot['metrics']}) {
 const [period,setPeriod]=useState('all')
 const ids=[...new Set([...metrics.map(m=>m.periodId),...snapshotMetrics.map(m=>m.periodId)].filter((p):p is string=>!!p && p!=='all'))].sort().reverse()
 const periodKey=ids.join('|')
 const allowed=useMemo(()=>['all',...periodKey.split('|').filter(Boolean)],[periodKey])
 useEffect(()=>{const read=()=>{const next=new URLSearchParams(window.location.search).get('period')??'all';setPeriod(allowed.includes(next)?next:'all')};read();window.addEventListener('popstate',read);return()=>window.removeEventListener('popstate',read)},[allowed])
 const choose=(next:string)=>{setPeriod(next);const url=new URL(window.location.href);if(next==='all')url.searchParams.delete('period');else url.searchParams.set('period',next);window.history.replaceState(null,'',url)}
 const legacy=period==='all'?metrics:metrics.filter(m=>m.periodId===period)
 const current=snapshotMetrics.filter(m=>m.periodId===period)
 const labels:Record<string,string>={'product-users-unique':'Unique product users','event-participants-unique':'Event participants','event-attendances':'Attendance instances','anonymous-actions':'Anonymous usage actions'}
 return <div><div className="flex flex-wrap justify-between items-center gap-4 mb-5"><h2 className="text-lg font-semibold text-foreground">Metrics</h2><Select label="Reporting period" value={period} onChange={e=>choose(e.target.value)}>{allowed.map(id=><option key={id} value={id}>{periodFor(id).label}</option>)}</Select></div>
 <div aria-live="polite" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{legacy.map(metric=><div key={metric.label} className="rounded-xl bg-card border border-border p-5"><p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">{metric.label}</p><p className="text-3xl font-bold text-foreground leading-none">{metric.value}</p>{metric.delta?<p className={`text-sm mt-2 font-medium ${metric.deltaPositive?'text-teal-400':'text-rose-400'}`}>{metric.delta}</p>:null}{metric.description?<p className="text-xs text-muted-foreground mt-1">{metric.description}</p>:null}</div>)}{current.map(metric=><div key={metric.id} className="rounded-xl bg-card border border-border p-5"><p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">{labels[metric.id]}</p><p className="text-3xl font-bold">{metric.value==null?'—':metric.value.toLocaleString('en-SG')}</p><p className="text-xs text-muted-foreground mt-2">{metric.coverage==='partial'?'Covered sources only':''}{metric.dataThrough?` · Through ${metric.dataThrough.slice(0,10)}`:''}</p></div>)}</div>
 {!ids.length?<p className="text-xs text-muted-foreground mt-4">Period breakdowns will appear as historical figures are verified.</p>:null}
 {period==='all'?<p className="text-xs text-muted-foreground mt-4">Previously published figures retain their original reporting periods and descriptions.</p>:null}
 </div>
}
