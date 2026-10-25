# Local Reporting Operations

The current release preserves all existing numeric figures. Collection sources, history
approval, anomaly-policy approval and publication are disabled by default. No job is installed.

## Runner environment

Use Node 24 (`.nvmrc`) and npm ci in a dedicated clean checkout on the Mac mini. Private
state and source-export directories must be absolute and outside Git checkouts. Their
permissions are restricted to the runner account. Never commit source files or environment values.

- REPORTS_STATE_DIR: private candidates, accepted snapshots, review records and safe status.
- REPORTS_SOURCE_DIR: reviewed normalized attendance export, named attendance.json.
- REPORTS_STRING_ID_DATABASE_URL / REPORTS_BINGO_DATABASE_URL / REPORTS_DIAGRAMS_DATABASE_URL:
  corresponding read-only PostgreSQL connections. No production binding is inferred from a repo.
- REPORTS_IDENTITY_MAP: optional reviewed private Google-to-String-ID map. Without it Bingo
  creator actions cannot enter the ecosystem unique-person headline.
- REPORTS_DEPLOYMENT_URL: existing HTTPS reports site whose static revision will be checked.

Source adapters use a read-only repeatable-read transaction, timeouts and an explicit row
limit. Overflow fails rather than publishing incomplete source data. Member-only Luma data
is not treated as a complete event attendance export. A reviewed file uses the strict
export schema in scripts/reporting/collect.ts and must include attended non-members where
covered; unresolved people remain outside the unique-person count and coverage stays partial.

## Review and activation

1. Finish Kah How's historical review, recover missing past figures, confirm source bindings,
   qualifying actions, read-only permissions and identity-link provenance.
2. Set reviewed config values in config/reporting-policy.json and enable only verified
   sources in config/reporting-sources.json. Confirm the numeric anomaly threshold explicitly.
3. Run npm run reports:run -- --dry-run. Inspect the private safe status and aggregate candidate.
   Exit 2 means held; 1 means failure; 0 means validated, unchanged or deployed as reported.
4. Accept a specific candidate with reports:accept -- --candidate ID --digest ID. Acceptance
   binds the public content and source-definition context; changed definitions require review.
5. Confirm branch rules: the implemented publisher permits only a clean, fast-forward,
   data-only push on its configured existing upstream branch. If branch protection requires
   PRs, keep publishing disabled until a permitted auto-merge path is configured. Never bypass.
6. Publication executes report tests, typecheck and build, commits only data/reports.snapshot.json,
   then verifies /reporting-revision.json. Only a matching deployed digest advances acceptance.
7. Rehearse rollback, source failure and anomaly holds and complete three staged scheduled runs.
8. Fill the launchd template locally, using the actual Node/checkout/state/log paths and the
   existing runner-account secret manager. Confirm the Mac mini timezone is Asia/Singapore:
   StartCalendarInterval uses the host timezone. Install only after the above gates pass.

The 06:00 daily job and RunAtLoad recover work after restart in the runner's existing login
context. Do not change auto-login or security settings. Held candidates do not restart-loop.

## Failures and recovery

reports:status reports safe local run state. Failed source reads keep the accepted snapshot.
Retries full-scan the bounded sources, so late records/deletions are included without missed
watermark windows. Dead process locks are reclaimed; live locks prevent overlapping publishers.
No raw error bodies, source rows or credentials are logged publicly.

Use reports:rollback -- --revision DIGEST to stage a prior deployed snapshot. Review/accept
that candidate explicitly and publish it as a new data commit. No Git reset is used. A failed
deployment never advances the accepted pointer. Restore only accepted aggregate snapshots.

Source check and completeness dates stay visible; no stale indicator is present. No alert
destination is configured and no notification messages are sent by this implementation.

Deployment checks poll for up to roughly twelve minutes including request timeouts. After
a pushed snapshot, a retry recognises identical committed content and resumes verification
without another data commit. Never reset a pushed commit to retry. If run.lock or recovery.lock
remains after a crash, check the owning PID and remove only a confirmed dead runner lock
locally; a recovery.lock is deliberately held conservatively rather than risking overlap.

Retention: operators must set an agreed private-state retention period before activation.
Delete obsolete raw exports and identity maps using the existing source deletion process;
recompute from reviewed exports, and review decreases rather than editing public counts.
Source owners/access gaps are recorded in specs/001-refresh-impact-reports/source-map.md.
An authorised local alert destination remains unconfigured; no external notification is sent.
