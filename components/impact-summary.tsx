import { AGGREGATE } from '@/lib/data'
import { reportMetric } from '@/lib/reporting/selectors'
import { ReportSourceDates } from './report-source-dates'
export function ImpactSummary(){
 const users=reportMetric('product-users-unique'),events=reportMetric('event-participants-unique')
 const hasVerifiedSplit=users?.value!=null && events?.value!=null
 return <div className="mb-14"><div className={`grid ${hasVerifiedSplit?'grid-cols-2 md:grid-cols-4':'grid-cols-3'} gap-4 p-6 rounded-xl border border-border bg-card`}>
 <div><p className="text-2xl font-bold text-foreground">{AGGREGATE.totalProjects}</p><p className="text-xs text-muted-foreground mt-1">Active products</p></div>
 {hasVerifiedSplit?<><div><p className="text-2xl font-bold text-foreground">{users.value!.toLocaleString('en-SG')}</p><p className="text-xs text-muted-foreground mt-1">Unique product users · all time</p></div><div><p className="text-2xl font-bold text-foreground">{events.value!.toLocaleString('en-SG')}</p><p className="text-xs text-muted-foreground mt-1">Event participants · all time</p></div></>:<div><p className="text-2xl font-bold text-foreground">{AGGREGATE.totalUsers}+</p><p className="text-xs text-muted-foreground mt-1">Legacy reported reach</p></div>}
 <div><p className="text-2xl font-bold text-foreground">{AGGREGATE.totalVolunteers}+</p><p className="text-xs text-muted-foreground mt-1">Volunteer contributors</p></div></div>
 <p className="text-xs text-muted-foreground mt-3">{hasVerifiedSplit?'All-time counts across covered sources. Product users and event participants are counted separately and may overlap.':'Legacy reach sums previously published figures with mixed units and repeat people; it is not a unique-person count. Verified product-user and event-participant counts will be reported separately.'}</p><ReportSourceDates /></div>
}
