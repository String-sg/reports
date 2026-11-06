# Reviewed editorial Luma catalogue — 1.0

A scoped extension to the existing editorial report data, authorised on 6 November 2026.
File: data/luma-events.json. Validation: lib/reporting/luma-events.ts. This is not an
automatically accepted source snapshot, and the publisher allowlist is unchanged.

Allowed top-level fields: schemaVersion=1, checkedOn (date), scope (curated explanation),
events (array). Each event allows only a public URL slug id, date (SG calendar date),
title, public luma.com URL, past/upcoming status, nullable nonnegative Going count and
nullable nonnegative recorded check-in count. No guest records, attendee IDs, contact
fields, survey responses, raw diagnostics or credentials. Unknown fields are rejected.

Past/upcoming status is validated relative to the review date. Only past entries enter
period totals; years/quarters use occurrence dates in Singapore time. A missing check-in
total is null, not zero attendance. Sums of check-ins count repeated visits; Going sums
count event registrations. Neither is labelled unique people. Partial scope is visible.

Historical figures outside this review retain explicit legacy labels. A future daily
import must independently satisfy the existing public snapshot and private fact contracts;
this file does not bypass baseline, identity, coverage or publication gates.

## Primary event total — user decision, 6 November 2026

Use Going RSVPs as the primary event count: 416 across the 16 covered past
educator/community listings. Recorded check-ins (260) remain supporting evidence.
The primary label stays Going RSVPs; it does not claim attendance or unique people.
Internal sessions and upcoming events remain excluded. No data values or coverage
changed in this presentation update.
