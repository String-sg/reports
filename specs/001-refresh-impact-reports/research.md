# Research Decisions for String Reports

Reviewed 2026-10-25. Facts are recorded in the linked audits. This document separates
architecture decisions from source activation evidence still needed.

## Reporting boundary

**Decision**: Generate a strict public aggregate snapshot locally; keep current static
routes and curated project descriptions.
**Rationale**: Reports already renders all pages and OG images from `lib/data.ts`. The
existing architecture needs a stable data interface, not a hosted query service.
**Alternatives considered**: Browser calls expose unnecessary data surfaces; server-side
live queries add operational dependencies; continued manual edits do not meet daily freshness.

## Runtime and state

**Decision**: TypeScript batch CLI on Node 24 LTS; restricted local file-based normalized
state and atomic replacement, using the same schema types as the public reader.
**Rationale**: Reuse the existing project language/Zod without adding a database service or
native SQLite dependency before volume warrants it. Pipeline outputs remain independently testable.
**Alternatives considered**: A second Python codebase or permanent analytics backend adds
maintenance; a local SQLite migration remains possible if actual volume requires it.
Node 24 is currently supported LTS: [official release policy](https://nodejs.org/en/about/previous-releases).

## Separate unique people from usage

**Decision**: Separate product-user and event-participant unions; anonymous activity and
historic aggregates retain their own units.
**Rationale**: User explicitly chose separate counts; current totals mix incompatible units.
**Alternatives considered**: Summing reach or quarterly unique totals overstates distinct people.

## Identity evidence

**Decision**: Reuse stable String ID links plus controlled verified provider evidence.
Unresolved overlap remains source-local and is excluded from the ecosystem unique headline.
**Rationale**: String ID has stable member UUIDs, but not every source has links or verified
emails. Luma model membership does not establish complete attendance coverage.
**Alternatives considered**: Names, unverified email fields, browser IDs and guessed educator
status cannot establish a defensible cross-product unique-person total.

## Daily runner and publication

**Decision**: launchd local daily job; accepted baseline; deterministic anomaly holds;
aggregate-only Git publication followed by deployment digest verification.
**Rationale**: Matches user decisions and current Git-backed deployment. No collection
endpoint or secrets need to be present in the public bundle.
**Alternatives considered**: Cron in public CI moves credentials off the Mac; manual review
of every normal update conflicts with the chosen autopublish policy.

## Period control

**Decision**: Shared All time/year/quarter choices; newest quarters first; explicit in-progress
labels; Singapore-time boundaries; homepage headline remains all-time.
**Rationale**: The [OGP HAS metrics page](https://reports.open.gov.sg/has/metrics) was inspected
in-browser on 2026-10-23. Its quarterly selector defaults to 2026 Q3 and lists older quarters
in descending order. All time/year choices and fixed homepage tiles are String requirements,
not claims about OGP functionality.
**Alternatives considered**: Per-product ad hoc labels or reconstructing history from current
totals makes comparisons misleading.

## Shared UI and rollout

**Decision**: Extend `String-sg/string-brand-guide` with a versioned UI package and staged
consumer adoption. Proposed for UI review: reuse ID/Skills common light shell. Preserve app auth/routing.
**Rationale**: The brand source and all three code repositories are now mapped; React and
Tailwind versions differ. Framework-neutral components avoid an unrelated migration.
**Alternatives considered**: Copied CSS continues drift; one monorepo or forced upgrades
expand scope; runtime CDN updates remove independent rollback and review.

## Source activation gates

These are implementation prerequisites, not unresolved architecture choices:

- Confirm each source's actual deployed project/database and read-only access.
- Verify reviewed Luma attendance includes non-members or obtain complete attended exports.
- Confirm qualification and backfill support for Bingo and other identified products.
- Inspect retained Whine/Remarks identities and the actual MatCHER platform backend.
- Verify data publication branch rules, deploy integration and existing alert destination.
- Confirm shared package release permissions and consumer checks in isolated checkouts.

A source that fails a gate remains disabled with its exclusion visible. Existing aggregate
history is preserved as historical, not silently promoted into a unique-person claim.

## Evidence

- [Source and identity audit](source-map.md)
- [UI repo and component audit](ui-audit.md)
- [Reports baseline](https://github.com/String-sg/reports/tree/e0c8fae13d9d5aa22d81a433d87760693751282b)
- [Spec Kit existing-project process](https://github.github.com/spec-kit/guides/existing-projects.html)
