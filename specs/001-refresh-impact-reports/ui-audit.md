# Shared String UI: planning audit

Reviewed 25 October 2026. Planning only; no source applications, deployments, credentials or personal records changed or accessed.

## Verified sources

The authenticated GitHub CLI could read the private ID and Skills repositories that the connected GitHub tool did not expose.

| Product | Source and inspected revision | Current integration stack |
|---|---|---|
| Reports | [String-sg/reports `e0c8fae13d9d5aa22d81a433d87760693751282b`](https://github.com/String-sg/reports/tree/e0c8fae13d9d5aa22d81a433d87760693751282b) | Next 16.2, React 19.2, Tailwind 4.2, Radix primitives |
| ID | [ghostleek/string-id `5a3fcc160eec5030056595cea4cba7e2947cb8f8`](https://github.com/ghostleek/string-id/tree/5a3fcc160eec5030056595cea4cba7e2947cb8f8), private | Vite 8, React 18.2, React Router 7, Tailwind 3.4 |
| Skills | [String-sg/str-skills `d2c08334c779e948489a535b90101c23817384c4`](https://github.com/String-sg/str-skills/tree/d2c08334c779e948489a535b90101c23817384c4), private | Vite 5, React 18.2, React Router 6, Tailwind 3.4 |
| Brand | [String-sg/string-brand-guide `d6b12bfe8f972f9b34e505adf270bfda15d932f6`](https://github.com/String-sg/string-brand-guide/tree/d6b12bfe8f972f9b34e505adf270bfda15d932f6) | Existing CSS/JSON tokens, light/dark themes, logo assets, typography and contrast guidance |

These are source revisions, not verified production deployment SHAs. Live HTML and compiled UI assets at [ID](https://id.string.sg) and [Skills](https://skills.string.sg) were readable through HTTP even though the web browsing tool failed to open them.

## Observed alignment and drift

- All three share String mint `#75F8CC`, charcoal `#33373B`, Montserrat body text and Space Grotesk headings.
- ID and Skills have nearly identical light headers: white sticky header, subtle gray border, 1024px maximum width, 24px-high String logo followed by the product name, gray navigation and mint sign-in button. Both use a gray page background. Skills adds a product-specific footer.
- Reports has its own dark header and text-only product wordmark. Its global styles duplicate brand tokens. Its [portable brand reference](https://github.com/String-sg/reports/blob/e0c8fae13d9d5aa22d81a433d87760693751282b/string-brand.md) explicitly reflects Reports' dark-only implementation.
- Radius differs: Reports documents 12px cards; Skills uses 16px cards; ID has 26px landing feature cards. Preserve deliberate variants while removing accidental duplication.
- Reports' index imports `PROJECTS` and `AGGREGATE` directly and has no reporting-period selector. Generic Select and Tabs primitives exist in its UI folder. Period semantics and metric aggregation belong to Reports, with generic controls supplied by the UI package.
- Skills' [layout](https://github.com/String-sg/str-skills/blob/d2c08334c779e948489a535b90101c23817384c4/src/App.tsx) is a verified extraction starting point. ID's layout has the same structure with authentication-dependent actions.

## Recommended package location and boundary

Use the existing **String-sg/string-brand-guide** repository as the shared source. Add one versioned UI package there, with package name and registry chosen during implementation. Do not create a competing brand repository or merge the three apps.

Initial scope:

- Brand tokens and scoped theme CSS; approved logo assets.
- Brand/product wordmark, AppHeader, AppFooter, Container.
- Button, Card, Badge, Tabs and Select.
- Documented variants for light/dark surfaces, card purpose and product-specific navigation.

Integration constraints:

- React 18/19 peer dependencies; never bundle React.
- Router-neutral components. Each app supplies its own link/navigation adapter and active state.
- Plain or compiled scoped CSS independent of Tailwind 3/4; avoid global resets.
- Separate static components from interactive client components to support Next server rendering.
- Keep authentication, account fetching and sign-out actions inside each app; shared headers receive data and callbacks.
- Hosts retain font loading through `next/font` or existing stylesheet links, mapped to shared font variables.
- Keep metric models, reporting periods, API clients and data pulls outside the UI package.

## Release and rollout

1. Capture common component appearance and behavior in the shared spec: responsive header, navigation, focus states, empty/disabled states and theme variants. Decide the common shell's theme and card variants explicitly.
2. Extract tokens and common ID/Skills header structure into the brand repository. Build a small component preview demonstrating the supported variants.
3. Release an immutable package version. Each app pins its version and lockfile; shared UI is bundled at build time.
4. Adopt in Reports first, then ID and Skills through separate pull requests and deployments. Replace duplicated components incrementally.
5. Automate dependency update PRs across the three repositories. Each update passes the consumer's checks; package releases do not force simultaneous production releases.

Do not load mutable UI JavaScript from a runtime CDN. A failed package update should leave the last successfully deployed UI available.

## Planned rollout checks

- Package compatibility fixtures for React 18 and 19; Next and Vite consumers; Tailwind 3 and 4 coexistence.
- Build/type checks for the package and each affected application.
- Responsive visual comparison for common header/footer and controls, at desktop and narrow mobile widths.
- Keyboard navigation, focus visibility, accessible labels and contrast across light/dark variants.
- ID: required `npm run check`, `npm run build` and local end-to-end checks per its AGENTS.md. No production database testing for a UI rollout.
- Skills: its existing typecheck, unit tests and build, plus a browser check of browse, sign-in navigation and account shell.
- Reports: build and browser checks of index, detail pages, period selector behavior and generated sharing images if changed.

These are planned verification gates; no implementation tests were run during this audit.

## Source handling

The saved local ID checkout at `[local-audit-path]` was on `eb8b8da2f17e3b9ef77972c64a69ac94fabfecae`, behind inspected remote main, and contained unrelated tracked/untracked changes. It was left untouched. Implementation should use an isolated checkout from a freshly verified remote revision. No local Skills checkout was identified; its private remote source is now mapped.

## Decisions to settle in the specification

- Common shell theme and the supported card variants, including whether Reports keeps dark report content.
- Public package name/registry and release ownership. The package must contain no app secrets or private implementation code.
- Navigation contract: which cross-product links appear everywhere, and which are supplied per app.
- Which package changes count as breaking changes, and the acceptable delay before consumer apps adopt compatible updates.
