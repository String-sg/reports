# Tasks: Current and Consistent String Impact Reports

**Input**: [Plan](plan.md), [specification](spec.md), [research](research.md),
[data model](data-model.md) and [contracts](contracts/).
**Status**: Implementation around existing figures is complete locally. Checked tasks reflect implemented software; production activation and historical review remain open. Actual consolidated file paths and evidence are recorded in `docs/reporting-validation.md`.
**Tests**: Focused acceptance/contract verification is required by the specification's
scenarios and success criteria. No full source records in tests.

## Format and Paths

`- [ ] TNNN [P optional] [USn for story tasks] Action with exact file path.`
Paths without a repo prefix are relative to `String-sg/reports`. Cross-repo paths name their
owner/repo. Use isolated checkouts, especially for ID's dirty saved checkout. Runner private
state paths are configured outside Git, never placed under the source directories below.

## Phase 1: Setup

- [ ] T001 Recheck source revisions and production mappings, record verified/disabled sources and history gaps in `config/reporting-sources.json` and `specs/001-refresh-impact-reports/source-map.md`; do not treat unavailable source access as verified (FR-018).
- [ ] T002 Record user-verified historical coverage and missing past figures in `specs/001-refresh-impact-reports/historical-coverage-review.md` before accepting a replacement baseline; record qualifying actions, approved 06:00 schedule and proposed anomaly policy in `config/reporting-policy.json`; preserve historical units and freeze verified retired-source evidence explicitly (FR-002, FR-006, FR-011, FR-017).
- [x] T003 Define runner-only dependencies and `test:reporting`/`typecheck` scripts in `package.json` and its lockfile; keep source DB modules out of browser imports and respect local private-state exclusion in `.gitignore` (FR-010).

## Phase 2: Foundational Contracts

- [x] T004 Implement strict allowlisted public types in `lib/reporting/schema.ts` and pure contract fixtures in `tests/reporting/contracts.test.ts`: counts are non-negative integers or null, undeclared keys fail, and all period/source/definition references resolve (FR-006, FR-010, SC-002, SC-004).
- [x] T005 Define private adapter/fact types in `scripts/reporting/types.ts` and stable source registry loading in `scripts/reporting/config.ts`; separate source-local identities, reconciled people and anonymous measurement units (FR-003, FR-004, FR-005, FR-016).

**Checkpoint**: Contracts and source eligibility are sufficient for synthetic work. Live
access gaps gate only affected adapters/activation; fixture-based UI work can proceed.

## Phase 3: User Story 1 - Trustworthy Split Counts (Priority: P1)

**Independent test**: Synthetic overlap/anonymous/legacy fixtures yield product users 2,
participants 2 and attendances 3, with honest coverage and no combined total.

- [x] T006 [US1] Add overlap, unverified identity, directory opt-out attendance and missing-history fixtures to `tests/reporting/counts.test.ts` using the exact expected values in `quickstart.md` (FR-001 through FR-006, SC-001).
- [x] T007 [P] [US1] Implement provenance-aware deterministic person reconciliation in `scripts/reporting/identity.ts`; never merge names/unverified email or count unresolved cross-source people in the ecosystem headline (FR-003).
- [x] T008 [US1] Implement eligible-action and attendance-set aggregation in `scripts/reporting/aggregate.ts`; preserve separate unions and source-local anonymous/historical units (FR-001, FR-002, FR-004, FR-005).
- [ ] T009 [P] [US1] Add verified read-only adapters under `scripts/reporting/adapters/{string-id,attendance,bingo,diagrams}.ts` against `config/reporting-sources.json`; reconcile raw eligible attendance including non-members before enabling the event source, and leave unverified sources disabled (FR-002, FR-004, FR-018).
- [x] T010 [US1] Add snapshot-backed selectors, coverage and source-date rendering in `lib/reporting/selectors.ts`, `components/report-coverage.tsx` and `components/report-source-dates.tsx`; do not add stale badges, age warnings or a 48-hour UI threshold (FR-006, FR-012, SC-002, SC-006).
- [x] T011 [US1] Replace numeric `teacherImpact` aggregation with the validated snapshot reader in `lib/data.ts`, `app/page.tsx` and `app/[slug]/page.tsx`; keep one report route, curated prose and unknown values, generate Git-excluded `public/reporting-revision.json` at prebuild using `scripts/reporting/build-revision.ts`, and align `app/opengraph-image.tsx` if its totals change (FR-001, FR-005, FR-016).

## Phase 4: User Story 2 - Consistent Periods (Priority: P1)

**Independent test**: A two-quarter person counts once in each eligible quarter and once
all-time; homepage headlines remain all-time after changing supporting periods.

- [x] T012 [P] [US2] Implement half-open Asia/Singapore period construction in `lib/reporting/periods.ts`, including All time, year and newest-first quarter choices and explicit partial/unavailable status (FR-007, FR-008).
- [x] T013 [US2] Implement `components/report-period-select.tsx` against the generic Select contract, with accessible labels and URL-preserved selection; integrate snapshot-only period views in `app/[slug]/page.tsx` and supporting homepage content while keeping its headline scope all-time (FR-007, FR-008, FR-015).
- [x] T014 [US2] Verify Singapore-midnight/year boundaries, late-import occurrence dates, overlapping quarters, unavailable-vs-zero, quiet-source check/completeness dates and common active-source cutoffs in `tests/reporting/periods.test.ts` and a browser check recorded in `docs/reporting-validation.md` (FR-007, FR-008, SC-001, SC-002).

## Phase 5: User Story 3 - Reliable Daily Publication (Priority: P2)

**Independent test**: Identical replay is idempotent; a failed source, invalid field, anomaly
or failed deployment never advances the accepted public version.

- [x] T015 [US3] Implement atomic restricted local state, input revisions, deletion/late-arrival handling and a single-run lock in `scripts/reporting/state.ts` and `scripts/reporting/collect.ts`; minimum normalized records remain outside Git (FR-009, FR-010, FR-013).
- [x] T016 [US3] Implement candidate validation/holds in `scripts/reporting/validate.ts` using the reviewed policy: baseline, definition/coverage changes, missing required sources and unexplained decreases; the numeric positive-spike threshold remains proposed as max(20, 20%) until reviewed (FR-011, FR-017).
- [x] T017 [US3] Implement allowlisted data-only publishing in `scripts/reporting/publish.ts` and `scripts/reporting/deployment.ts`; honour branch rules, run explicit type/build checks, verify deployed snapshot digest before accepted-pointer advancement, and support restoring prior snapshots in a new commit (FR-010 through FR-013).
- [x] T018 [US3] Wire scheduled `reports:run` orchestration and collect/validate/accept/publish/status/rollback interfaces in `scripts/reporting/cli.ts` and `package.json` per `contracts/local-runner.md`, including digest-bound review, exit 0/2/1 behaviour and safe local summaries (FR-011, FR-012, FR-013, SC-006).
- [x] T019 [US3] Add the approved 06:00 Singapore time daily launchd `reports:run` invocation and boot/login/catch-up/secret-loading runbook in `ops/launchd/sg.string.reports.plist` and `ops/reporting-runbook.md`; do not install it before activation gates pass (FR-009, SC-006).
- [ ] T020 [US3] Verify retries, locking, raw-field rejection, holds, failed deployment and rollback with synthetic inputs in `tests/reporting/publication.test.ts`; verify no personal fields in public output/log paths (FR-010 through FR-013, SC-003, SC-004, SC-007).

## Phase 6: User Story 4 - Shared String UI (Priority: P2)

**Independent test**: Common shell/controls work in all three current stacks without
changing authentication, routing or metric calculations.

- [x] T021 [US4] Define the UI package exports, React18/19 peers, static/client entrypoints and preview in `String-sg/string-brand-guide/packages/ui/package.json` and `packages/ui/src/index.ts`; React is not bundled (FR-014).
- [x] T022 [US4] Extract authoritative tokens, logo, scoped light/default and dark-surface variants plus Brand/Header/Footer/Container/Button/Card/Badge into `String-sg/string-brand-guide/packages/ui/src/` and `packages/ui/src/styles.css`; avoid global resets and Tailwind dependencies (FR-014, FR-015).
- [x] T023 [US4] Implement generic accessible Tabs/Select in `String-sg/string-brand-guide/packages/ui/src/client.ts` and its components, keeping report-period interpretation inside Reports (FR-014, FR-015).
- [ ] T024 [US4] Build immutable UI release tarballs in `String-sg/string-brand-guide/scripts/release-ui.mjs` and `.github/workflows/release-ui.yml`; verify Next/Vite and React18/19 fixtures under `packages/ui/fixtures/` before release (FR-014, SC-005).
- [x] T025 [US4] Adopt the released package in Reports `app/layout.tsx`, `app/globals.css`, relevant shared components and dependency lockfile; preserve static routes and pure snapshot rendering (FR-014).
- [x] T026 [P] [US4] Adopt common shell/controls in `ghostleek/string-id/src/App.tsx` and dependency lockfile in an isolated checkout, preserving account actions and required repo checks (FR-014).
- [x] T027 [P] [US4] Adopt common shell/controls in `String-sg/str-skills/src/App.tsx` and dependency lockfile in an isolated checkout, preserving browse/sign-in navigation (FR-014).
- [x] T028 [US4] Add consumer update PR generation and compatibility/adoption tracking in `String-sg/string-brand-guide/.github/workflows/update-consumers.yml` and `docs/ui-consumers.md`; propose compatible updates within one day of release (FR-014).
- [x] T029 [US4] Record per-app build/type checks, desktop/375px comparison, labels/focus/keyboard journeys and account navigation in `String-sg/string-brand-guide/docs/ui-validation.md` (FR-014, FR-015, SC-005).

## Phase 7: Polish and Activation

- [x] T030 Update Reports `CLAUDE.md`, `dev.md` and `README.md` for the adopted metric definitions, periods, shared tokens and public/private boundary; remove conflicting sum-of-teacherImpact/dark-only/no-selector guidance explicitly (FR-016, FR-017).
- [ ] T031 Record baseline reconciliation, three consecutive scheduled staging runs, catch-up, hold and rollback/deployed-digest evidence in `docs/reporting-validation.md`; activate production job only after these gates and plan acceptance (FR-009, FR-011, FR-012, FR-018, SC-003, SC-007).
- [ ] T032 Record source owner/access gaps, accepted definitions, retention/deletion procedure, local authorised alert destination and change/rollback procedure in `ops/reporting-runbook.md`; never move private records into a public issue or PR (FR-006, FR-010, FR-017, FR-018, SC-006).

## Dependencies and Execution Order

Setup -> foundational contracts -> US1/US2/US3 fixture work and US4 package work.
US1 aggregation and public contract precede real US3 publication. US2 may develop against
fixtures before US1 live adapters; it integrates after the public reader exists. US4 may
progress independently of live source access; release package before consumer adoption.
Reports adopts the shared package before parallel ID/Skills adoption. Activation follows
all relevant source/data gates and staging rehearsals. Unavailable sources remain disabled;
they do not block adoption of UI components or truthful reporting for covered sources.

Parallel examples: US1 identity (T007) and source adapters (T009) after contracts; US2 period
logic (T012) alongside US1 adapter work; US3 state/collector development alongside US4 package
work in separate repositories; ID (T026) and Skills (T027) after the validated release and
Reports integration. Tasks sharing a file run sequentially.

## Implementation Strategy

Start with US1 synthetic counts and coverage display as the smallest useful reviewable
slice. Add periods and shared UI without requiring live publication. Then onboard actual
sources in dry-run mode, accept a defensible baseline, rehearse failures and only then enable
the daily automatic publisher. Never substitute legacy aggregates to make an incomplete
unique-person headline look complete. All source tracking repairs are separately scoped.

## Implementation notes and remaining gates

Identity handling lives in aggregate.ts and adapters/postgres.ts; registry loading is in
cli.ts. Fixtures are consolidated in tests/reporting/core.test.ts, preservation.test.ts
and publication.test.ts. Period UI is report-metrics.tsx; coverage is rendered there and
in impact-summary.tsx. Launchd is deliberately a .plist.template. Consumers use a built
immutable 0.1.0 tarball pending upstream release. These path consolidations do not add
new sources or change qualifying activity. T011 is implemented with the explicit user
authorisation to preserve existing figures until historical review, rather than replacing
the legacy total immediately. T009, T020, T024, T031 and T032 remain partially complete:
production binding, full publication/rollback rehearsal, release activation and operational
review have not occurred.

## 6 November — authorised event reconciliation

- [x] T033 Audit event-level Luma summaries and record identity-free evidence in docs/luma-reconciliation.md.
- [x] T034 Add the scoped event catalogue, separate Going/check-in metrics and unavailable unique-person count, calendar periods and upcoming-event exclusion. Correct legacy participant claims.
- [ ] T035 DEFERRED by user: guest exports and attendance identity deduplication. Use event totals only for now; do not pursue Confirm Access or display a unique-person count. Revisit only on a later request.
- [x] T036 User confirmed exclusion of internal/operational sessions from public impact scope.

- [x] T037 Use Going RSVPs as the primary event total and catalogue/OG highlight; retain check-ins as a supporting measure, per user instruction.
