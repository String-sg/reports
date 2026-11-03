# Implementation validation — 25 October 2026

Implemented around existing published figures, as authorised. No production figures,
source databases, deployment configuration or scheduled jobs were changed.

## Verified locally

- Reports: 14 reporting tests, explicit TypeScript check and production build pass.
- Preservation regression compares every original PROJECTS value (excluding newly added
  period metadata) and AGGREGATE against the pre-change revision. All numbers unchanged.
- Synthetic tests cover separate identity unions, anonymous/unverified activity,
  excluded registrations/sign-ins, strict public output, Singapore period boundaries,
  independent source cutoffs, anomaly holds, private state/locking and delayed deployment.
- Browser: All time defaults, 2024 selection displays only the published 2024 figures,
  query parameter persists; shared shell checked at desktop and 375px on all three apps.
- ID: check (95 unit tests and typecheck), build and 187 local e2e tests pass.
  E2E used an isolated local PostgreSQL database and fixture/mocked integrations.
- Skills: typecheck, five unit tests and build pass.
- Shared UI: package build/pack and release/update script syntax checks pass. The same
  0.1.0 tarball is vendored in all consumers; React remains a peer dependency.
- Default runner reports held/no_verified_sources/history_pending; no publication occurs.

## Still required before activation

Historical reconciliation and reviewed baseline; live read-only source bindings and schema
verification; complete attendance coverage; reviewed identity links; numeric anomaly-policy
approval; branch-rule-compatible publishing permissions; shared UI release/update credential;
three consecutive scheduled staging runs; live digest verification and rollback rehearsal.
SQL adapters and release workflows have not been exercised against production.

The new split unique-person headline only replaces legacy totals after a valid reviewed
snapshot is accepted. No unverified recovered historical figure is displayed.

## 3 November preview repair

Vercel team access verified. The original PR preview failed resolving Google's font
files in Turbopack. Bundling the canonical brand TTFs using next/font/local removes
that build-time dependency. Local production build and all 14 reporting tests pass;
no data values or font families/weights changed. Upstream preview validation follows
on the same draft PR.
