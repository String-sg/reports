# Plan

1. Integrate the existing Shapes and footer PR branches and the current main favicon.
2. Port the approved concept to typed React pages and scoped CSS; retain shared shell,
   source definitions and the canonical footer generator rather than a static embed.
3. Centralise approved headline assumptions and current product metadata, and reuse
   the validated Shapes aggregate feed for the homepage and detailed report.
4. Record aggregate event categories without raw per-event counts, and publish the
   conversation-derived changelog with planned work explicitly marked.
5. Run reporting/summary tests, typecheck, build, meaningful UI/availability checks,
   footer drift check and desktop/mobile review. Push and gate the exact PR head.
6. Merge the owner-authorised release, wait for the production build, and verify the
   public homepage, changelog, product route, footer and deployed commit.

The release audit found existing framework/transitive and validation-library advisories.
Use patched Next 16.4.6 and Zod 4.6.7, compatible transitive fixes, and the explicit
Zod record key schema. Re-run all reporting contracts and typecheck after upgrading.
Keep elapsed but unreviewed calendar entries outside participation totals and do
not display them as future scheduled events.

## Follow-up: headline caption

Remove the North Star caption and its estimate wording in the share preview and
current changelog entry. Preserve 1,800+, the teaching heading, modelled hours,
source privacy and existing layout. Update existing assertions, run reporting
checks and build, then verify the exact production release and responsive layout.
