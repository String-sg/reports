import { inPeriod, type ReportPeriod } from '../../lib/reporting/periods'
import { factSchema, type SourceDefinition, type UsageFact } from './types'
const nonUse = new Set(['sign_in','signin','sign-in','login','registration','register','signup','sign_up'])
export function aggregate(input: UsageFact[], sources: SourceDefinition[], period: ReportPeriod) {
  const definitions = new Map(sources.map(s=>[s.id,s])); const seen = new Map<string,string>()
  const products = new Set<string>(), participants = new Set<string>()
  let attendances = 0, anonymousActions = 0
  for (const raw of input) {
    const fact = factSchema.parse(raw), source = definitions.get(fact.sourceId)
    if (!source) throw new Error('Unknown fact source')
    const key = `${fact.sourceId}:${fact.key}`, fingerprint = JSON.stringify(fact)
    if(seen.has(key)) { if(seen.get(key)!==fingerprint) throw new Error('Conflicting repeated fact'); continue }
    seen.set(key,fingerprint)
    if (!inPeriod(fact.occurredAt,period) || !source.actions.includes(fact.action) || nonUse.has(fact.action.toLowerCase())) continue
    const person = fact.person?.verified ? fact.person.canonicalId : null
    if (source.kind === 'event') { if(fact.action !== 'attended') continue; attendances++; if(person) participants.add(person) }
    else if(person) products.add(person)
    else anonymousActions++
  }
  return { productUsers: products.size, eventParticipants: participants.size, attendances, anonymousActions }
}
