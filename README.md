# String impact reports

Public impact reports at reports.string.sg. Next.js 16, React 19, TypeScript and Tailwind 4.

## Development

Use Node 24, then `npm ci`, `npm run dev`. Before review run `npm run test:reporting`,
`npm run typecheck` and `npm run build`.

## Reporting boundary

Curated reports and existing figures remain in `lib/data.ts`. They retain their original
units and descriptions while historical coverage is reviewed. The existing 2,874+ teacher
reach total is a legacy sum, not an ecosystem count of distinct people.

New public aggregates use the strict identity-free `data/reports.snapshot.json` contract.
Product users and event participants are deduplicated separately using verified identity
links and qualifying activity. Registrations and sign-ins alone do not count. Anonymous
and unreconciled activity remains in action units. The homepage uses All time; detail
reports offer consistent Singapore calendar periods and retain selection in the URL.
Missing history is not zero. Recovered quarters await review.

A local runner collects and validates privately, then publishes only the aggregate snapshot.
Source connections and raw facts stay outside the website and Git. The static build exposes
only a public revision file for deployment verification. Sources and publication are disabled
until the activation gates pass. No public collection API or stale badge is added.

## Shared UI

`@string-sg/ui` comes from String-sg/string-brand-guide. Reports, String ID and Skills pin
one immutable vendored package. It supplies scoped tokens, brand/header/footer and controls
across React 18/19 without changing host routing or authentication. Reports retains its dark
surface; ID and Skills retain their light surfaces. Reports-specific styling stays in
`app/globals.css`; package styles are imported in `app/layout.tsx`.

See [operations](ops/reporting-runbook.md), [validation](docs/reporting-validation.md) and
[Spec Kit plan](specs/001-refresh-impact-reports/plan.md). No job is installed by this PR.

Event reporting uses aggregate-only `data/event-report.json`. Detailed participation
logs remain local and untracked; see [event reporting](docs/event-reporting.md).
