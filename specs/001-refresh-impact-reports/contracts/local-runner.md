# Local Runner Contract

Commands below are the proposed interface to implement, not commands available today.
All execute on the Mac mini in its dedicated automation checkout with private state outside Git.

| Command | Behaviour |
| --- | --- |
| npm run reports:run | Daily orchestrator: collect, reconcile, aggregate, validate, publish eligible candidates and verify deployment; held candidates never publish |
| npm run reports:run -- --dry-run | Same pipeline through staging/validation only; never push |
| npm run reports:collect -- --dry-run | Read enabled verified sources, normalize/reconcile and stage a candidate locally; never push |
| npm run reports:validate -- --candidate ID | Validate typed public output, coverage and anomaly rules |
| npm run reports:publish -- --candidate ID | Publish only an eligible candidate, then verify deployment digest |
| npm run reports:accept -- --candidate ID --digest DIGEST | Accept a specific baseline/anomaly after review; rerun checks before publishing |
| npm run reports:status | Show local latest run, per-source cutoff, hold reasons and deployed revision |
| npm run reports:rollback -- --revision DIGEST | Stage a prior accepted snapshot as a new publication; never reset app history |

ID and DIGEST in this table denote arguments, not defaults. Credentials never appear as CLI
arguments or output. Configuration references existing local secrets; no secret values in Git.
The live collection modes remain inactive until source access and plan acceptance are resolved.

The launchd ProgramArguments invoke the absolute npm executable with `run reports:run`
in the dedicated automation checkout. Exit 0 means deployed or verified no-op; exit 2
means held for review; exit 1 means failure. An already-running lock is a logged no-op.
Do not configure an immediate restart loop on a held candidate. Retries are bounded within
the run, with the next daily/catch-up invocation handling further work.

## Adapter result

Private adapter output supplies source ID, schema/revision/cutoff, normalized record keys,
activity times, eligibility and identity provenance. It declares coverage exclusions,
collection mode and complete/incomplete result. Adapters never emit preformatted public HTML
or treat operational admin totals as ecosystem impact measures. Sources are read-only.

## Daily and failure policy

- Approved schedule: 06:00 Asia/Singapore, with catch-up after restart/login; actual runner
  session/boot behaviour must pass a smoke test. One lock prevents concurrent publishers.
- First baseline, source-set/definition changes, invalid payloads, missing required sources,
  impossible counts and unexplained cumulative decreases are held.
- Proposed spike threshold: either headline increases by more than max(20 people, 20% of
  its preceding accepted value). Policy/config version is recorded and can be reviewed later.
- Review queues show candidate digest, safe aggregate diff and reason codes. No raw user
  records are copied into a GitHub issue/PR or outgoing alert.
- An outage never changes missing input into zero or advances accepted source coverage.
- Expired access or changed source schema fails the source; repeated failure never weakens gates.
- Deployment failure leaves the last accepted version and a local actionable failure summary.

Alerts initially stay in the private local run/status log. Configure an existing authorised
maintainer notification destination during activation; this plan sends no messages. The public
site keeps source dates visible without stale indicators.

## Persistence and recovery

Persist minimum normalized facts, identity provenance, high-water marks and accepted/candidate
payloads in restricted local files with atomic replacement and backups. Keep files outside
all Git checkouts and cloud-public paths. Source exports are temporary; deletion/unlink changes
must propagate under the agreed source retention policy. Query timeouts and bounded retries
prevent endless jobs. Validate historical source volume before choosing full scans; introduce
incremental windows only with deletion and late-arrival handling.

## Publication permissions

Confirm existing Git branch rules and deployment integration read-only. Use allowed fast-forward
pushes or a data-only PR with permitted auto-merge. Do not grant bypass access or relax branch
protection. Keep publish credentials scoped to the data update path as far as repository
permissions support; always enforce the file allowlist locally and in CI. Dry-run and held
candidates cannot invoke publishing. Only the final deploy check advances the accepted pointer.
