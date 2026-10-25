# Validation and Activation Guide

This is a proposed implementation runbook. Runner commands and fixtures below do not exist
until the tasks are implemented. No production data pull or publication has occurred.

## Prerequisites

Plan accepted; historical coverage verified by Kah How before replacement baseline; isolated
app/brand checkouts; Node 24 LTS pinned; production source bindings
verified; least-privilege read-only source access installed locally; restricted private-state
path; accepted activity/identity rules and history; deployment permissions confirmed.

## Fixture validation before live access

1. Add synthetic people A/B/C: A uses products X and Y, B uses X, C attends event E1 and E2,
   and A attends E2. Expected product users = 2; participants = 2; attendances = 3.
2. Put A's X action in Q1 and Y action in Q2. Expected unique products Q1 = 2 if B's action
   is also in Q1, Q2 = 1, all-time = 2. Never sum quarters to get 3 all-time users.
3. Add an anonymous Diagrams exporter and Bingo player session. Expected people headlines
   remain unchanged, with separate anonymous measures.
4. Include an attendee without directory opt-in but valid attendance identity. Expected
   participant inclusion is independent of directory visibility.
5. Add unknown history, missing values, current-quarter facts and a Singapore-midnight
   boundary. Verify unavailable vs zero, in-progress labels and correct period membership.
6. Replay an identical import/candidate. Expected stable metric revision and no duplicate facts.
7. Pull a healthy source with no recent activity. Expected current check/completeness dates
   and no age-warning UI. Exercise source lag and the minimum
   active-source cutoff without letting a frozen retired source stall current coverage.

## Planned commands after implementation

```sh
npm run test:reporting
npm run typecheck
npm run build
npm run reports:run -- --dry-run
npm run reports:status
```

The implementation defines these scripts; their proposed names are part of the runner contract.
No private records may be copied into the fixture test suite or public CI.

## Live source dry run

Enable one verified source at a time. Compare query/export totals against source-owner
statistics with identical filters and cutoff. Check identity provenance and duplicates locally.
For Luma, reconcile total attended rows, matched members and unresolved non-members; do not
reuse directory-only operational totals. Source failures leave candidates private and held.
Freeze verified retired-source baselines explicitly rather than claiming fresh collection.

## Publication rehearsal

- First candidate is held for baseline review. Inspect aggregate-only payload/diff.
- Inject a personal-data key, missing source, coverage change, spike and cumulative decrease.
  Each candidate must be rejected or held; the accepted public file remains unchanged.
- Accept one exact candidate digest. Exercise the allowlisted data commit and permitted
  Git path in staging; verify the deployed revision, not merely successful push/build.
- Simulate deployment failure; accepted pointer must remain the previous deployed version.
- Restore the prior snapshot via a new data-only change and verify recovery.
- Complete three consecutive scheduled staging runs, including restart/login catch-up,
  before enabling production auto-publication.

## UI consumer checks

Render the common shell in Reports, ID and Skills at desktop and 375px width. Check keyboard
navigation, labels, focus, sign-in/account routes, font variables and both supported surfaces.
Run each repo's actual AGENTS/CI checks from isolated checkouts. Reports needs explicit
TypeScript checks because its current Next configuration ignores type errors during build.
Do not run production database tests as part of a shared-component rollout.

## Acceptance evidence

Record synthetic expected/actual values, source reconciliation cutoffs, public payload check,
held-candidate outcomes, three staged runs, deployed digest and rollback evidence. Record the
accepted source coverage and initial unique counts only after those checks. The old 2,874+
and 527 values are not acceptance baselines for distinct-person metrics.
