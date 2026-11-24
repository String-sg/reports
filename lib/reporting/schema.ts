import { z } from 'zod'
import { singaporeCompletionDate } from '../shapes-completion-periods'
import { periodFor } from './periods'
const id = z.string().regex(/^[a-z][a-z0-9-]*$/)
const timestamp = z.string().datetime().nullable()
export const sourceSchema = z.object({ id, dataThrough: timestamp, checkedAt: timestamp, status: z.enum(['active','frozen','unavailable']) }).strict()
export const metricDefinitions = [
 {id:'product-users-unique',label:'Unique product users',unit:'people',method:'distinct-reconciled-people'},
 {id:'event-participants-unique',label:'Event participants',unit:'people',method:'distinct-reconciled-people'},
 {id:'event-attendances',label:'Attendance instances',unit:'attendances',method:'count-qualified-facts'},
 {id:'anonymous-actions',label:'Anonymous or unreconciled usage actions',unit:'actions',method:'count-qualified-facts'},
 {id:'diagrams-exporter-browsers',label:'PNG exporter browsers',unit:'browsers',method:'distinct-exporter-browsers'},
 {id:'diagrams-png-exports',label:'PNG exports',unit:'exports',method:'count-recorded-exports'},
 {id:'shapes-games-completed',label:'Completed games',unit:'games',method:'distinct-completion-references'},
] as const
const metricId = z.enum(metricDefinitions.map(metric => metric.id))
const count = z.number().int().nonnegative()
export const shapesPublicStartDate = '2026-11-01'
export const shapesDailyCompletionsSchema = z.object({
  days: z.array(z.object({
    date: z.iso.date().refine(date => date >= shapesPublicStartDate, 'Completion dates must be within public coverage'),
    completedGames: count,
  }).strict()),
  undated: count,
}).strict().refine(({ days }) => days.every((bucket, index) => index === 0 || days[index - 1].date < bucket.date), {
  path: ['days'],
  message: 'Completion dates must be unique and in chronological order',
})
export type ShapesDailyCompletions = z.infer<typeof shapesDailyCompletionsSchema>
export function shapesDailyTotal({ days, undated }: ShapesDailyCompletions) {
  return days.reduce((total, day) => total + day.completedGames, undated)
}

export const metricSchema = z.object({
  id: metricId, scope: id, periodId: z.string().regex(/^(all|year:\d{4}|quarter:\d{4}-Q[1-4])$/),
  value: count.nullable(), coverage: z.enum(['complete','partial','unavailable','frozen']),
  sourceIds: z.array(id), dataThrough: timestamp,
  dailyCompletions: shapesDailyCompletionsSchema.optional(),
}).strict().superRefine((metric, ctx) => {
  const breakdown = metric.dailyCompletions
  if (!breakdown) return
  if (metric.id !== 'shapes-games-completed' || metric.scope !== 'primary-2-shapes-adventure' || metric.periodId !== 'all') {
    ctx.addIssue({ code: 'custom', path: ['dailyCompletions'], message: 'Daily completions require the all-time Shapes metric' })
  }
  if (metric.value !== shapesDailyTotal(breakdown)) {
    ctx.addIssue({ code: 'custom', path: ['dailyCompletions'], message: 'Daily and undated completions must equal the metric total' })
  }
  const through = metric.dataThrough && Number.isFinite(Date.parse(metric.dataThrough))
    ? singaporeCompletionDate(metric.dataThrough)
    : null
  if (!through || breakdown.days.some(day => day.date > through)) {
    ctx.addIssue({ code: 'custom', path: ['dailyCompletions'], message: 'Completion dates require source coverage through the last recorded day' })
  }
})
export const productMetricBindings = {
  'diagrams-exporter-browsers': { sourceId: 'diagrams', scope: 'diagrams' },
  'diagrams-png-exports': { sourceId: 'diagrams', scope: 'diagrams' },
  'shapes-games-completed': { sourceId: 'shapes-records', scope: 'primary-2-shapes-adventure' },
} as const
export function isProductCount(id: string): id is keyof typeof productMetricBindings {
  return Object.hasOwn(productMetricBindings, id)
}
const periodSchema=z.object({id:z.string(),label:z.string(),start:timestamp,end:timestamp}).strict()
const definitionSchema=z.object({id:metricId,label:z.string(),unit:z.string(),method:z.string()}).strict()
const methodology='People are deduplicated across covered sources using verified identity links and qualifying activity. Product use and event attendance are separate. Registration and sign-in alone do not count.'
export const snapshotSchema = z.object({ schemaVersion: z.literal(1), definitionVersion: z.literal('1.0.0'), generatedAt: z.string().datetime(), revision:z.string().regex(/^[a-f0-9]{64}$/).optional(),timezone:z.literal('Asia/Singapore').default('Asia/Singapore'),periods:z.array(periodSchema).default([periodFor('all')]),definitions:z.array(definitionSchema).default([...metricDefinitions]),methodology:z.literal(methodology).default(methodology),sources: z.array(sourceSchema), metrics: z.array(metricSchema) }).strict().superRefine((value, ctx) => {
  const ids = new Set(value.sources.map(s=>s.id)); const keys = new Set<string>(), periods=new Set(value.periods.map(p=>p.id))
  if(ids.size !== value.sources.length) ctx.addIssue({ code:'custom', message:'Duplicate sources' })
  if(periods.size!==value.periods.length)ctx.addIssue({code:'custom',message:'Duplicate periods'})
  for(const period of value.periods){try{if(JSON.stringify(period)!==JSON.stringify(periodFor(period.id)))ctx.addIssue({code:'custom',message:'Incorrect period boundary or label'})}catch{ctx.addIssue({code:'custom',message:'Invalid period'})}}
  const defs=new Set<string>()
  for(const def of value.definitions){const expected=metricDefinitions.find(d=>d.id===def.id);if(!expected || JSON.stringify(expected)!==JSON.stringify(def) || defs.has(def.id))ctx.addIssue({code:'custom',message:'Invalid metric definition'});defs.add(def.id)}
  for(const metric of value.metrics) {
    const key = `${metric.id}:${metric.scope}:${metric.periodId}`
    if(keys.has(key)) ctx.addIssue({ code:'custom', message:'Duplicate metrics' }); keys.add(key)
    if(metric.sourceIds.some(id=>!ids.has(id)) || !periods.has(metric.periodId) || !defs.has(metric.id)) ctx.addIssue({ code:'custom', message:'Unknown metric reference' })
    if((metric.coverage==='unavailable') !== (metric.value===null)) ctx.addIssue({code:'custom',message:'Unavailable metrics must be null'})
    if (isProductCount(metric.id)) {
      const binding = productMetricBindings[metric.id]
      if (metric.scope !== binding.scope || metric.periodId !== 'all' || metric.sourceIds.length !== 1 || metric.sourceIds[0] !== binding.sourceId) {
        ctx.addIssue({ code: 'custom', message: 'Product count must use its own all-time source and scope' })
      }
    }
  }
})
export type ReportSnapshot = z.infer<typeof snapshotSchema>
