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

---

## 2026-03-28 — Remarks Co-Pilot deprecated; alternative recommendations added

### Decision: Remarks Co-Pilot → Deprecated
- Status changed from Maintenance to Deprecated.
- 2026 Q1 update added to the timeline noting the deprecation and recommending SmartCompose.
- AGGREGATE.totalProjects reduced to 1 (only String is active).

### Decision: `DeprecatedAlternative` component
- New component at `components/deprecated-alternative.tsx`.
- Renders an amber-toned banner on the detail page for any product with `status: "Deprecated"` and an `alternative` field.
- Join CTA is hidden for deprecated products.
- Alternatives:
  - Remarks Co-Pilot → SmartCompose (https://www.smartcompose.gov.sg)
  - Whine → ForumSG (https://forumsg.hack2026.gov.sg/sign-in)

---

---

## 2026-03-28 — Whine metrics populated from CSV export

### Data source: `/Downloads/0328_204534/` CSV export
- **User.csv**: 568 confirmed registered users (sgid auth, Jan 2024 – Jun 2025)
- **Post.csv**: 343 total records → 164 active top-level submissions, 150 active replies, 29 deleted
- **Event.csv**: 10 events (Build for Good '23 through GT Build '25)
- **LikedPosts.csv**: 497 total likes across 181 posts, 83 unique likers
- **Tag.csv + _PostToTag.csv**: Education 32%, HR 25%, Healthcare 24%, OGP Tools 12%, Innovation Office 7%
- **Resolved**: 18 posts with an accepted reply (~11% resolution rate)
- **AssignedUsers.csv**: empty — feature exists in schema but unused
- **Teacher filter on Whine users**: 109 of 568 users have teacher-domain emails (`@moe.gov.sg`, `@moe.edu.sg`, `@school.gov.sg`, or any `*.edu.sg`). Includes polytechnics and universities (NYP, NTU, NUHS etc.) per the filter criteria.
- **Aggregate totalUsers** updated to "1,934" (1,825 Remarks Co-Pilot + 109 Whine teacher-domain users). Label changed to "Teachers reached".

## Pending
- [ ] Verify `mau` metric definition for RemarkscopIlot and update label if needed
- [ ] Add real contributor names to `lib/data.ts`
- [ ] Update aggregate `Educators reached` once String's registered user count is available
- [ ] Update aggregate `Volunteer contributors` count
- [ ] Add String URL once rebuilt product is live
