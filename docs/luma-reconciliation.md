# Luma reconciliation — 6 November 2026

Reviewed through the user-authorised, logged-in Brave browser. Only event metadata and
aggregate status counts enter this repository. No guest names, addresses or exports are stored.

## Findings

- Public-report subset: 16 past educator/community listings; 416 current Going RSVPs.
- 260 recorded check-ins across 11 listings with a displayed check-in total.
- Five listings have no displayed check-in total: unknown attendance, not zero attendance.
- Five internal/operational calendar listings excluded pending scope confirmation.
- Upcoming AI Learning Journey #7 (10 November) is excluded from totals.
- Counts are sums of event-level statuses; repeat people count again.
- Unique event participants remain unavailable pending reviewed identity deduplication.

| Date (SG) | Event | Going RSVPs | Recorded check-ins |
|---|---|---:|---:|
| 2026-11-03 | [Chat with SEA EdTech Founders](https://luma.com/ukphmovb) | 5 | Not recorded |
| 2026-09-18 | [AI Learning Journey for Educators #6 (GAINS)](https://luma.com/hxc61pdy) | 68 | 53 |
| 2026-08-28 | [AI Learning Journey for Educators #5](https://luma.com/btz2n1i2) | 34 | 19 |
| 2026-07-31 | [AI Learning Journey for Educators #4](https://luma.com/dsxz5qlk) | 36 | 21 |
| 2026-06-26 | [AI Learning Journey for Educators #3](https://luma.com/2rygretp) | 18 | 11 |
| 2026-06-04 | [AI Learning Journey for Educators #2](https://luma.com/7yff96sc) | 15 | 14 |
| 2026-05-06 | [AI Learning Journey for educators](https://luma.com/avx1ftbp) | 12 | 2 |
| 2026-03-17 | [Can AI Become Your Teaching Assistant? (Round IV)](https://luma.com/ktuev6vq) | 80 | 55 |
| 2025-11-13 | [Q4 String Meetup x Stick 'Em](https://luma.com/01qogcdp) | 44 | 41 |
| 2025-10-02 | [Vibe Coding for educators and Student Teachers + Heritage Tour](https://luma.com/m71jjd36) | 14 | 13 |
| 2025-09-03 | [String Q3 Meetup @ Google](https://luma.com/ymk0bf9n) | 38 | Not recorded |
| 2025-07-30 | [AI-yo: how teachers turned painpoints into solutions](https://luma.com/p55qph7n) | 17 | 16 |
| 2025-07-25 | [[LunchLearning] HuxeAI v NotebookLM](https://luma.com/uy0w9kjl) | 1 | Not recorded |
| 2025-07-18 | [[LunchLearning] HuxeAI v NotebookLM](https://luma.com/uqcsagdu) | 2 | Not recorded |
| 2025-05-29 | [Supporting schools via a Product-centric Approach](https://luma.com/cgelgfhu) | 24 | 15 |
| 2025-04-29 | [Educational value of AI talking heads](https://luma.com/ygcyy3dt) | 8 | Not recorded |

## Corrections to published claims

- March Round IV: 80 Going / 55 recorded check-ins, rather than 80 confirmed participants.
- Q4 2025 meetup: 44 Going / 41 recorded check-ins; previous prose reported 45 participants.
- AI-yo: 17 Going / 16 recorded check-ins.
- School support: 24 Going / 15 recorded check-ins.
- Q3 meetup: 38 Going; no displayed check-in total.
- April webinar: 8 Going; no displayed check-in total.
- September 2025 Quick Dive (15), SST 2024 (100) and Tech Talk series 2023 (200)
  remain explicitly labelled legacy evidence outside this calendar review.
- Legacy 527 is neither verified attendance nor unique people; remove it from the
  Events highlight. The overall legacy aggregate retains the historic inputs and is
  explicitly labelled legacy reported reach rather than teachers reached.

## Access and automation

The March guest CSV download prompted Luma Confirm Access (passkey/SMS/email).
No verification was performed by the agent; no fresh guest CSV was obtained. Existing
Downloads files were not used to infer unique people. Additional authentication must
be completed by the user before export/deduplication. No Luma credential was created.

The public site uses a reviewed, identity-free catalogue, not a live browser or API call.
Daily refresh is still off: raw attendance and product-source bindings are not verified.
A calendar audit does not prove full historical coverage, delivery of every listed event,
or complete check-in practice. Published check-ins are a partial recorded total.

## Deployment state

Reports PR #23 is now merged. Vercel production deployment for main commit 9e572c8
is READY. This corrects the previously reported pre-merge status. The current reconciliation
is a separate reviewable change; no production merge or local-job activation is performed.

## Validation

16 reporting tests, explicit typecheck and production build pass. Period tests cover
2025 (85 check-ins), 2026 (175), Q2 2026 (27), Q3 2026 (93) and Q4 2026 unknown
check-ins / five Going RSVPs. Browser checks recorded with the implementation delivery.

Browser checks: All time shows 260/416/16 and unavailable unique participants.
2026 Q3 shows 93 check-ins / 138 Going / three events. Q4 shows unknown check-ins
and five Going. Selection persists in the URL; narrow/wide rendered widths have no
horizontal overflow. No console errors observed. Screenshot saved with delivery.
