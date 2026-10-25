# Shared UI Contract

**Owner/source**: existing `String-sg/string-brand-guide` repository.
**Proposed package name**: `@string-sg/ui`; name does not require a new npm account for tarball distribution.

## Exports and ownership

Export immutable brand tokens, scoped CSS and approved logos; Brand, AppHeader, AppFooter,
Container, Button, Card, Badge, Tabs and Select. Headers receive product label, navigation,
active state and app-provided account actions. Components do not fetch accounts or source data.

Consumers own routing/link adapters, authentication actions, font loading and page content.
Reports owns metric definitions and period ranges; shared Select owns only control behaviour.
No database clients, private account models or app-specific network requests in the package.

## Compatibility

- React and React DOM are peers supporting 18 and 19; do not bundle React.
- Scoped compiled CSS and variables work alongside Tailwind 3 and 4, without global resets.
- Static entrypoint works with Next server components; interactive exports have explicit
  client boundaries and do not pull browser-only dependencies into static exports.
- Link adapters work with Next Link, React Router 6 and 7, and ordinary anchors.
- Existing approved brand assets are authoritative; derived conventions remain documented.

## Appearance and interaction

Proposed for UI review: use ID/Skills' common light shell by default: 1024px content width, existing logo/product
wordmark pattern, gray navigation and mint primary action. Supply an explicit dark-surface
variant for report panels when justified. Define card variants purposefully instead of
preserving three accidental radius values as independent app rules.

All controls require accessible labels, keyboard operation, visible focus, disabled states
and narrow-mobile behaviour. Do not copy OGP's government masthead into String. Period control
labels/selection must remain visible to assistive technology and persist in report URLs.

## Release and adoption

Build an npm-compatible tarball at an immutable `ui-vX.Y.Z` GitHub Release. Pin the exact
release URL/version and lockfile integrity in each consumer. Check release permissions
before activation. No mutable runtime CDN; no package release instantly changes deployed apps.

Version breaking prop/visual-contract changes with a major version; add backward-compatible
components/variants with a minor version; fixes use a patch version. Use consumer update PRs
with checks. Review deliberate visual changes; do not make unreviewed forced upgrades.
Compatibility releases should produce consumer update PRs within one day; adoption is tracked
until each app's checks and release pass, with failures visible to the maintainer.

Adopt Reports first, then ID and Skills in separate isolated checkouts. Verify React18/19,
Next/Vite and Tailwind3/4 compatibility fixtures, each app's actual build/type checks, account
navigation, mobile/desktop rendering, focus and keyboard behaviour. Preserve auth and source
tracking; the UI rollout must not repair metrics or migrate frameworks implicitly.
