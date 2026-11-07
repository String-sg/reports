# Public event report contract — 1.0

File: data/event-report.json. Validator: lib/reporting/events.ts.

Allowed fields: schemaVersion=1, reviewedOn (date), events (public id/date/title/url/
past-or-upcoming status), periods (id/participation/estimated). Every object rejects
unknown keys. Period coverage must match the dated past events. Upcoming events do
not enter totals. The + suffix preserves the requested presentation of estimates.

Provider counts, check-ins, per-event participant totals, school-source details and
identity records stay outside Git. Public event rows contain names and dates only.
This reviewed editorial snapshot is not acceptance of a daily source or unique-person
baseline, and does not change the automated publisher allowlist.

The local CSV columns are date, event, total_participation, luma, non_luma and
other_details. Unknown split values remain blank; an organiser full-event estimate
replaces the overlapping registration baseline rather than adding both. Any new
private-field schema must remain separate from the public schema.
