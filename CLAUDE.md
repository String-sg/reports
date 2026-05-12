# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`reports.string.sg` — public-facing impact reports for String, a volunteer-run edutech ecosystem. Static-rendered marketing site built with Next.js 16 (App Router) + React 19 + Tailwind v4 + shadcn/ui, deployed on Vercel.

## Commands

```bash
npm install
npm run dev      # next dev — local dev server
npm run build    # next build — production build
npm run start    # next start — serve built output
npm run lint     # eslint .
```

No test suite exists.

## Architecture

### Content is data, not pages

All product reports are entries in a single typed array: `lib/data.ts` → `PROJECTS: Project[]`. There is exactly **one dynamic route** (`app/[slug]/page.tsx`) that renders any project by slug, plus an index (`app/page.tsx`). `generateStaticParams` enumerates `PROJECTS` so every report is statically generated at build time. **Adding a new report = adding an entry to `PROJECTS`.** Do not create a per-product page file.

### Aggregate stats are auto-computed

`AGGREGATE` at the bottom of `lib/data.ts` derives `totalUsers` and `totalVolunteers` by summing the `teacherImpact` and `volunteers` fields across `PROJECTS`. To change the home-page strip numbers, edit those per-project fields — do not hardcode aggregate values. `totalProjects` is a manual count of non-deprecated products.

`teacherImpact` is intentionally a teacher-domain-filtered count for some products (e.g. Whine uses 109, not its 568 raw user count). See `dev.md` for the filter criteria.

### Status drives behaviour

`ProjectStatus = "Building" | "Prototype" | "Maintenance" | "Deprecated"` is the only state machine in the app:
- Index sorts by `STATUS_ORDER` (Building → Maintenance → Prototype → Deprecated), then by `since` desc.
- Detail page hides the Join CTA when status is `Deprecated`.
- Detail page renders `<DeprecatedAlternative>` when status is `Deprecated` **and** `alternative` is set.
- Status badge colours and the OG image status pill are keyed off the same union.

If you add a status value, update: `STATUS_ORDER` in `app/page.tsx`, `STATUS_CONFIG` in `components/project-card.tsx`, and `STATUS_COLOR`/`STATUS_BG` in `app/[slug]/opengraph-image.tsx`.

### Brand tokens (dark mode only)

`app/globals.css` is the single source of design tokens. The site is **dark-mode-only** — there is no light variant and no theme toggle. Use the CSS-variable-backed Tailwind utilities (`bg-card`, `text-primary`, `text-muted-foreground`, etc.), not raw hex values. `string-brand.md` documents the full token system and component patterns; read it before adding new visual styles.

**Gotcha:** there are two `globals.css` files. `app/globals.css` is the active one (imported by `app/layout.tsx`) — String brand, dark mode. `styles/globals.css` is the shadcn-default OKLCH starter and is **unused**; don't edit it expecting changes to apply. Consider removing it if cleaning up.

### shadcn/ui

Configured via `components.json` (style: `new-york`, base: `neutral`, RSC, lucide icons). Components live under `components/ui/`. Most are installed but unused by current pages — only `components/project-card.tsx` and `components/deprecated-alternative.tsx` are wired in. Prefer extending these app-level components over pulling in more shadcn primitives unless genuinely needed.

### OpenGraph images

Generated at request/build time via `next/og` `ImageResponse`:
- `app/opengraph-image.tsx` → index
- `app/[slug]/opengraph-image.tsx` → per-project

Next.js auto-discovers these file-conventional routes. **Do not** add `openGraph.images` to `app/layout.tsx` metadata — it will conflict. Inside the OG handlers, colours are inlined as hex (CSS variables don't apply in `ImageResponse`) and `fontFamily` is system `sans-serif` (custom fonts would require `fetch()`-ing the font file in the handler).

### Path alias

`@/*` → repo root (`tsconfig.json`). Imports use `@/lib/...`, `@/components/...`, `@/hooks/...`.

### Async params

App Router pages and OG handlers receive `params: Promise<{ slug: string }>` — always `await params` before destructuring. This matches Next.js 16 conventions.

## Conventions

- **External links** always include `target="_blank"` and `rel="noopener noreferrer"`.
- **Card click pattern**: project cards use an invisible full-card `<Link>` with `absolute inset-0`; interactive children inside (e.g. "Try it") use `relative z-10` to sit above it. Don't nest `<a>` inside `<Link>`.
- **Volunteer counts**: the `volunteers` numeric field on a project overrides `contributors.length` for display. Use it when the real headcount is known but contributor names aren't yet filled in.
- **Headings** use Space Grotesk (`--font-space-grotesk`); body uses Montserrat (`--font-montserrat`). Both are loaded via `next/font/google` in `app/layout.tsx`.

## Notable config

- `next.config.mjs` sets `typescript.ignoreBuildErrors: true` and `images.unoptimized: true`. Type errors won't block production builds — run `npx tsc --noEmit` if you need to verify types. Images are unoptimised because the site is small and deployed statically.
- `dev.md` is the running change log / decision record. When making non-trivial product or data decisions (status changes, aggregate methodology, new audience/problem types), append a dated entry there.

## Contribution workflow

Work on the branch specified by the current task or follow the repository's standard branching workflow. When changes are ready, open a PR using the normal review process for the repository.
