# Event participation reporting

The public report shows reviewed participation totals by reporting period, event
names and dates. Estimates use the requested + suffix. Internal and upcoming events
are excluded; repeat participation is included. Distinct people are not claimed.

The detailed participation ledger is local, outside every Git checkout. It records
date, event, total participation, Luma, non-Luma and other details. Unknown splits
remain blank; registrations are not treated as confirmed attendance. School anchors
and source reconciliation stay in that ledger. No CSV, photo or source breakdown
is bundled into the site or committed.

Public data is allowlisted by lib/reporting/events.ts: event metadata and period
aggregates only. Provider counts, check-ins and organiser-level inputs are rejected.
The existing one-report route and shared period control remain unchanged.

Historical metadata may link to String community write-ups. Dates accept an exact
day, YYYY-MM or YYYY-H1/H2. Month-only dates enter their known quarter; half-year
dates enter all-time/year totals only, without an invented quarter or day.
