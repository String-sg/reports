# Feature Specification: Light Reports layout

## User scenarios

1. A reader follows Events or a product from the homepage and sees the same light Reports identity, navigation and content edges. A direct URL and the Changelog have the same shell.
2. A reader uses a keyboard or a phone to choose a reporting period, move through sections and read a chart or table. Focus is visible, the page fits the viewport and the period remains in the URL.
3. A reader opens a report with incomplete or unavailable data and can still distinguish an unavailable value, an empty period and a reported zero.

## Requirements

- FR-001. Match the approved homepage colours, fonts and alignment on every product, Events and Changelog. Use shared layout primitives and spacing tokens for report content and panels.
- FR-002. Keep one complete canonical String footer on each route. Keep existing link destinations and active period semantics.
- FR-003. Keep chart labels and series legible, and contain any horizontal table scroll at the table. Preserve table headings, keyboard access and metric status announcements.
- FR-004. Preserve the existing public aggregates, methodology qualifiers, date ranges and visibility boundaries. Styling changes introduce no data source or collection behaviour.

## Success criteria

- SC-001. The homepage, all generated report URLs and Changelog render with matching content edges at desktop and mobile widths.
- SC-002. Keyboard and URL period checks pass on the built site. Charts, table headers and unavailable messages remain usable at 320 CSS pixels.
- SC-003. Each route renders one full String footer. Review screenshots use existing public content and synthetic Shapes usage data.
