# Public Snapshot Contract

**Contract version**: 1.0 proposed. **Consumer**: static Reports app.
**Planned artifact**: `data/reports.snapshot.json`. No new public query API.

## Allowed top-level fields

| Field | Type | Rule |
| --- | --- | --- |
| schemaVersion | literal 1 | Reject unsupported versions |
| definitionVersion | version string | Changed meaning requires reviewed revision |
| revision | content digest string | Digest of canonical public payload excluding this field |
| generatedAt | UTC timestamp | Time this changed public payload was prepared; not a freshness claim |
| timezone | literal Asia/Singapore | Controls range/label semantics |
| periods | array | Period IDs, labels, kind, start/end, partial flag |
| definitions | array | Metric IDs, units, explanations and aggregation methods |
| sources | array | Public source IDs, included/frozen state, coverage range, checkedAt and dataThrough |
| metrics | array | Results matching the field list below |
| methodology | curated text/links | Definitions, limitations and historic revision explanation |

Each object rejects undeclared keys. Query strings, private connection details, internal
error bodies and source-row text are not allowed. No school/person cohort segmentation in v1.

## Result fields

`metricId`, `periodId`, `scope` (ecosystem or existing product slug), `value` (number or null),
`coverage` (complete within declared scope / partial / unavailable / frozen), `sourceIds`,
`dataThrough`, `limitationCodes` (fixed safe codes), and optional `revisionNote` from curated text.
Required identity units and method come from the referenced definition. Sources with
unresolved global overlap do not enter the ecosystem unique-person metric.

Initial definitions:

- `product_users_unique`: reconciled people with qualifying product use; ecosystem union.
- `event_participants_unique`: distinct evidenced attendees; separate union.
- `event_attendances`: eligible attendance instances, not distinct people.
- Source/product-specific anonymous browser/session and action totals, explicitly labelled.
- Legacy registered-user/attendance totals only as dated historical measures with their units.

A missing headline is null with coverage explanation. The legacy 2,874+ is never used as a
fallback unique-person figure. A period result that lacks timestamps stays unavailable.

## Validation and freshness

Validate schema, integer/range checks, references, period bounds, distinct <= eligible facts,
coverage stability, eligible unit consistency, anomaly policy and public-field allowlist.
Reconstruct public output from approved keys and validate again immediately before publication.
Reject accidental raw records even when nested in a result or error field. Secret scanning
is defence in depth, not the primary privacy control.

Public source freshness distinguishes successful check time, extraction completeness and
latest activity. `dataThrough` means extraction completeness as defined in the data model,
never simply the latest action timestamp. Ecosystem results use the minimum required active
source cutoff and truncate active facts to it; approved frozen historical intervals remain
explicit and do not stall the current cutoff. A quiet source still records a current check. A
daily pull of a manually reviewed import updates check time, not the attendance cutoff.
Frozen historical sources retain their cutoff and do not look newly collected. Display
source check/coverage dates without stale badges, age warnings or a 48-hour threshold.

Replays with identical logical input/coverage do not create a new metric revision merely
because the runner retried. A genuine new daily freshness check may publish changed freshness
metadata. Maintain a private run ledger regardless of whether a public commit is required.

## Publication boundary

Only this file is eligible for automated data commits. Build metadata and safe commit text
must not contain source identities, secrets or candidate diagnostics. No private files or
raw logs enter CI. Record deployed revision using an already-public metadata artifact `public/reporting-revision.json` from the same build, served at
`/reporting-revision.json`; it contains only revision and schema version. Generate it from
the validated snapshot committed in this build during prebuild, exclude it from Git, and verify its deployed digest.
It is a static build artifact, not a new authenticated or collection endpoint.
