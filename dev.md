# dev.md — Product Decisions & Change Log

## 2026-03-24 — Initial migration to Next.js

### Decision: Replace static HTML with Next.js (design reference as base)
- **Before**: Static HTML + Bootstrap 5 + custom CSS in `docs/`, served via GitHub Pages.
- **After**: Next.js 16 + Tailwind CSS v4 + shadcn/ui, deploying to Vercel.
- **Why**: Design reference (`b_83hrvDmfNxo-1774309288529`) provided a polished, componentised UI. Vercel deployment unlocks CI/CD, better performance, and easier iteration.

### Decision: `docs/` folder removed entirely
- Old static pages (`docs/remarkscopilot/`, `docs/string/`, `docs/whine/`) are replaced by the Next.js `app/[slug]/page.tsx` route.
- Old `CNAME` file removed; Vercel handles custom domains.

### Data source: existing `docs/` folder is source of truth
- All metrics, dates, and descriptions were pulled from the existing HTML pages and `remarkscopilot/assets/app.js`. The design reference contained placeholder/mock data and was **not** used for content.

### Decision: Flatten metrics — no quarter selector
- RemarkscopIlot's existing page had a quarter dropdown (8 quarters of history).
- Replaced with a single snapshot using the **latest available quarter (2025 Q2)** for all metrics.
- Rationale: simpler reader experience; quarterly drill-down adds maintenance overhead for a volunteer-run project.

### Decision: Introduce "Quarterly active users" for RemarkscopIlot
- Sourced from the `mau` field in the old `app.js` (value: `53,894` for 2025 Q2).
- **⚠️ TODO**: Verify what this field actually counts — with 1,825 total registered users, 53,894 likely represents quarterly sessions or pageload events rather than unique active users. Confirm and relabel if needed.

### Decision: Whine — keep as Deprecated
- Whine was built for Public Officers in Hack for Public Good 2024.
- Deprecated as of 15 Jun 2025; key features migrating to String.
- Shown as a card on the index with `Deprecated` status so history is preserved.
- No usage metrics available for Whine.

### Decision: String — Solutions Aggregator mapped to status "Building"
- Existing HTML used the label "Rebuild In Progress" which maps to `Building` in the design reference's status type.

### Decision: Aggregate stats on index use conservative real numbers
- **Active products**: 2 (Remarks Co-Pilot on Maintenance, String on Building; Whine excluded as deprecated).
- **Educators reached**: `1,825+` — sourced from RemarkscopIlot's registered user count. String adds more but its data is sessions/views, not registered unique users. Needs update once String user count is available.
- **Volunteer contributors**: placeholder (`—`) — to be updated when contributor list is finalised.
- **Total infra cost / quarter**: `$50` — RemarkscopIlot only; String runs on free tier ($0).

### Decision: "Public Officers" added as Audience type
- Whine was built for Public Officers; this wasn't in the design reference's type union and was added.

### TODO: Add real contributor names
- Contributors are currently empty arrays (`[]`) in `lib/data.ts`.
- User will fill these in separately.

---

## Pending
- [ ] Verify `mau` metric definition for RemarkscopIlot and update label if needed
- [ ] Add real contributor names to `lib/data.ts`
- [ ] Update aggregate `Educators reached` once String's registered user count is available
- [ ] Update aggregate `Volunteer contributors` count
- [ ] Add String URL once rebuilt product is live
