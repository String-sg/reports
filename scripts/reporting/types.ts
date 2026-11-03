import { z } from 'zod'
export const factSchema = z.object({ key: z.string().min(1), sourceId: z.string().min(1), action: z.string().min(1), occurredAt: z.string().datetime(), person: z.object({ canonicalId: z.string().min(1), verified: z.boolean() }).strict().nullable() }).strict()
export type UsageFact = z.infer<typeof factSchema>
export interface SourceDefinition { id: string; product: string; actions: string[]; kind: 'product' | 'event' }
export interface PublicationPolicy { historyApproved: boolean; publicationEnabled: boolean; anomalyPolicyApproved: boolean; spikeAbsolute?: number; spikeRelative?: number }
