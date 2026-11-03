<!-- Sync Impact Report: initial scaffold -> 0.1.0 proposal. Added five principles,
delivery boundaries and review gates. No principles removed. Ratification remains
pending upstream acceptance; no adoption by other repositories is claimed. -->
# String Reports Constitution

## Core Principles

### I. Evidence before impact claims

Every published metric MUST have a definition, source, coverage period and measurement
unit. Unique product users and event participants MUST remain separate. Anonymous
browsers, registrations and attendance totals MUST NOT be presented as deduplicated
people. All-time people counts MUST use identity-level union within the stated coverage,
never sums of product or period counts. Historical limitations MUST stay visible. Registration or sign-in alone MUST NOT qualify
as product use. Historical baseline changes MUST await Kah How's coverage verification.

### II. Private collection and public aggregates

Scheduled collection and identity reconciliation MUST run on the designated local Mac
mini. Credentials, source records and identity mappings MUST remain private. Only fields
explicitly allowed by the public aggregate contract may reach the reports repository or
site. The reporting feature MUST NOT introduce a public collection or administration API.

### III. Reliable daily publication

Validated daily data updates MUST publish automatically. Failed collection, invalid
contracts and anomalous changes MUST preserve the last accepted snapshot and hold the
candidate for review. Publication MUST record source freshness separately from build
time. Repeated runs MUST be idempotent and deployment success MUST be verified.

### IV. Shared user interface and consistent periods

Reports, String ID and Skills MUST consume versioned shared brand tokens and common
interface components. The package MUST respect their framework and router boundaries.
Period controls MUST share labels and Singapore-time boundaries. The reports homepage
headline counts MUST remain explicitly all-time.

### V. Small maintainable changes

The existing project catalogue and single data-driven report route MUST be preserved.
The new data boundary MUST be a generated, validated aggregate snapshot. Curated prose
MUST remain editorial content. Validation MUST cover metric semantics, publication
failure recovery and the shared UI rather than simply repeat implementation markup.

## Delivery Boundaries

The audience is donors, impact grant providers, schools and MOE. Use the existing static
reports app. New persistent services, framework migrations, forced sign-in for anonymous
tools and retroactive identity guesses are outside this change. Shared package adoption
and report data publication remain separate release operations.

## Development Workflow

Use Spec Kit for specification, clarifications, research, contracts, ordered tasks and
cross-artifact analysis. Update dev.md for adopted product or metric decisions. During
planning, app source, live databases, jobs and deployments remain untouched. Implementation
starts after the user accepts the plan or requests implementation. Activation requires
verified production source mappings, an accepted baseline and a successful staged run.
Source access gaps gate their own adapters; they never justify fabricated totals.

## Governance

This is proposed governance derived from the user's instructions and repo conventions.
Upstream adoption occurs through normal review. Amendments MUST record the change,
rationale, affected contracts and migration needs. Use semantic versions: major for
incompatible principles, minor for added principles, patch for clarifications. Review
each implementation slice against these principles. Update conflicting older repository
instructions explicitly when the new methodology is adopted.

**Version**: 0.1.0 | **Ratified**: TODO(upstream acceptance) | **Last Amended**: 2026-10-25
