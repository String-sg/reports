# Reporting Data Model

## Public and private separation

Private entities never serialize directly to public output. Public output is constructed
from an explicit allowlist, not by deleting a few private keys from a source object.

| Entity | Visibility | Essential fields and constraints |
| --- | --- | --- |
| Product | Public editorial | Stable slug, name, status and prose; source registration never creates a card automatically |
| Source configuration | Private configuration | sourceId, productSlug/event scope, adapter, eligible actions, enabled flag, frozen flag, credential reference, history start/end, ownership |
| Identity evidence | Private | source-local ID, canonical member link or verified provider reference, verification provenance, merge/conflict state; no name-only matching |
| Usage fact | Private | unique source+record key, sourceId, optional local person key, activity type, occurredAt, ingestedAt, eligibility, unit |
| Attendance fact | Private | stable event ID, occurrence time, source attendee ID, optional person key, attended evidence and import revision |
| Period | Public | stable ID, kind, exclusive end/inclusive start, Asia/Singapore label, partial flag |
| Metric definition | Public | ID, unit, aggregation rule, eligible-action explanation, definition version |
| Metric result | Public | definition ID, period ID, product scope or ecosystem scope, nullable numeric value, coverage state, source references and data-through cutoff |
| Source freshness | Public aggregate metadata | Public-safe source ID, checked-at date/time, data-through cutoff, active/frozen/unavailable designation; no connection URL or query text |
| Publication candidate | Private | Run ID, payload digest, source input revisions, validation results, hold reason codes, accepted baseline reference and publication state |

## Validation rules

- Counts are non-negative integers or null; null means unavailable, never zero.
- Money, rates and counts have distinct units. Display strings do not replace numeric values.
- All references resolve to stable declared IDs; unexpected fields fail the public schema.
- Every result has exactly one period and metric definition; its coverage explains exclusions.
- Ecosystem unique product users use a person set, not a sum of product results.
- Source-local people with unresolved cross-product overlap stay outside that headline.
- Distinct event participants are separate from total attendance instances and product users.
- A canonical person counts once per selected scope/period, even after repeated imports.
- Unknown/unverified identities stay unresolved. Provider-specific IDs from different namespaces
  never compare directly; verified links must provide the crosswalk.
- Raw names, emails, phone numbers, user IDs, provider IDs and their digests never appear in public fields.
- Public free text comes from curated definitions or fixed templates, not source-row values.
- No product or source disappears from accepted coverage without a reviewed baseline revision.

## Freshness and completeness

`checkedAt` is the successful extraction/check time. `dataThrough` is the upper boundary
through which the extraction is known complete, not the most recent usage event. Keep
`lastActivityAt` separate if needed. A quiet live source can have old activity and a current
completeness cutoff. Display these source dates without a stale warning. Honour upstream lag
when choosing that cutoff. The common cutoff for an ecosystem result is the minimum
complete-through boundary across its required active sources; count eligible active-source
facts only through that boundary. Approved frozen sources contribute only their declared
historical interval and do not hold back the current active-source cutoff. Display all
source intervals so the shared cutoff does not imply complete history everywhere.

For attendance exports, daily re-reading does not extend the export coverage. Event-date
coverage and last reviewed import remain explicit. There is no public stale indicator or
48-hour age threshold. Private local status still records failed or missed collection, while
frozen/manual-history sources retain their coverage state.

## Identity and historical change

Mappings retain provenance and local revision history. Conflicting links are held for
review, not guessed. A source-local identity can become reconciled once verified evidence
exists. Reconciliation can change historic counts; mark the methodology revision and run
all affected periods again. Deleted-account/null-identity history must remain an explicitly
limited measurement unless permitted retained evidence still supports the distinct count.
Do not retain data contrary to source deletion requirements merely to preserve a metric.

## Periods

Period IDs: `all`, `year:2026`, `quarter:2026-Q4` (examples, not a promise of data coverage).
Year and quarter boundaries are half-open ranges in Asia/Singapore, converted to UTC for
queries. Example Q1 2026 is [2025-12-31T16:00:00Z, 2026-03-31T16:00:00Z).
All-time uses each included source's evidence-backed history; no invented start date.
An event belongs to occurrence time rather than import time. Late-arriving changes
recompute affected periods. Current periods are partial. Historic totals without timestamps
cannot populate unavailable quarters or years.

## State transitions

Private candidate states:
`created -> collecting -> collected -> reconciled -> validated -> staged -> pushed -> deployed`.
Any pre-publish step can transition to `held` or `failed`. A held candidate can transition to
`validated` only after acceptance bound to its digest and renewed checks. A changed candidate
needs new acceptance. `pushed` is not `deployed`. After successful deployed-digest verification,
update the accepted pointer. A failed deployment keeps the previous accepted pointer.

Source states are `disabled`, `active`, `frozen`, `unavailable`. Enabling/disabling accepted
coverage is a review event. Any failed enabled required source holds the whole new candidate.
The existing site stays available and displays accepted source dates without age-warning UI.
