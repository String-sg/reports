# String Reports

Public-facing impact reports for the [String](https://string.sg) volunteer-run edutech ecosystem. Tracks metrics, updates, and impact across all active and past products.

**Live site → [reports.string.sg](https://reports.string.sg)**

---

## Table of Contents

- [Products](#products)
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [Dependencies](#dependencies)
- [Opportunities to Contribute](#opportunities-to-contribute)
- [Contributing](#contributing)

---

## Products

| Product | Status | Report |
|---|---|---|
| String — Solutions Aggregator | Building | [/string-solutions](https://reports.string.sg/string-solutions) |
| Events | Building | [/events](https://reports.string.sg/events) |
| Diagrams | Building | [/diagrams](https://reports.string.sg/diagrams) |
| MatCHER | Building | [/matcher](https://reports.string.sg/matcher) |
| Bingo | Maintenance | [/bingo](https://reports.string.sg/bingo) |
| Whine — Problem Bank | Deprecated | [/whine](https://reports.string.sg/whine) |
| Remarks Co-Pilot | Deprecated | [/remarkscopilot](https://reports.string.sg/remarkscopilot) |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (bundled with Node.js)

### Installation

```bash
git clone https://github.com/String-sg/reports.git
cd reports
npm install
```

### Local development

```bash
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000) with hot-reload.

### Build for production

```bash
npm run build   # static export via Next.js
npm run start   # serve the built output locally
```

### Lint

```bash
npm run lint    # runs eslint on the whole project
```

> **Note:** `eslint` is referenced in the `lint` script but is not yet listed in `devDependencies`. Run `npm install -D eslint` (or add it to `package.json`) before using this command. The `build` step does not block on TypeScript errors (`typescript.ignoreBuildErrors: true` in `next.config.mjs`) — run `npx tsc --noEmit` to check types manually.

---

## Architecture

### Tech stack

| Layer | Choice |
|-------|--------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| UI | [React 19](https://react.dev/) + [shadcn/ui](https://ui.shadcn.com/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Analytics | [@vercel/analytics](https://vercel.com/analytics) |
| Deployment | [Vercel](https://vercel.com/) |

### Directory structure

```
reports/
├── app/
│   ├── layout.tsx              # Root layout — fonts, metadata, analytics
│   ├── page.tsx                # Index page — lists all products
│   ├── globals.css             # ✅ Active design tokens (dark-mode-only)
│   ├── opengraph-image.tsx     # OG image for the index page
│   └── [slug]/
│       ├── page.tsx            # Dynamic product detail page
│       └── opengraph-image.tsx # OG image per product
├── components/
│   ├── project-card.tsx        # Product card used on the index
│   ├── deprecated-alternative.tsx  # Amber banner for deprecated products
│   └── ui/                     # shadcn/ui primitives (mostly installed, partially used)
├── lib/
│   └── data.ts                 # ⭐ Single source of truth for all product data
├── styles/
│   └── globals.css             # ⚠️  Unused shadcn-default starter — do not edit
├── public/                     # Static assets (favicons, icons)
├── next.config.mjs
├── components.json             # shadcn/ui config
└── tsconfig.json
```

### Content model

All product data lives in **`lib/data.ts`** as a single typed array `PROJECTS: Project[]`. There is exactly one dynamic route (`app/[slug]/page.tsx`) that renders any product by its slug. `generateStaticParams` enumerates `PROJECTS` at build time so every report is statically generated.

**To add a new product report, add one entry to `PROJECTS` — no new page file is needed.**

Key fields on `Project`:

| Field | Purpose |
|-------|---------|
| `slug` | URL path — e.g. `"bingo"` → `/bingo` |
| `status` | `"Building"` \| `"Prototype"` \| `"Maintenance"` \| `"Deprecated"` |
| `teacherImpact` | Teacher-domain filtered user count. Feeds the "Teachers reached" aggregate on the home page. |
| `volunteers` | Volunteer headcount (overrides `contributors.length` for display). |
| `alternative` | If set and status is `Deprecated`, renders the amber alternative-product banner. |
| `highlightStat` | The single prominent stat shown on the product card and OG image. |

### Aggregate stats

`AGGREGATE` (bottom of `lib/data.ts`) auto-computes:
- **`totalUsers`** — sum of `teacherImpact` across all projects
- **`totalVolunteers`** — sum of `volunteers` across all projects
- **`totalProjects`** — manual count of non-deprecated products

To change the home-page stat strip, edit the per-project fields — do not hardcode the aggregate values. Note that `totalUsers` and `totalVolunteers` are auto-computed from `PROJECTS`, but `totalProjects` is a manually maintained count of non-deprecated products and must be updated whenever a product changes status.

### Status-driven behaviour

| Status | Sort order | Join CTA | Deprecated banner |
|--------|-----------|----------|-------------------|
| Building | 1st | Shown | — |
| Maintenance | 2nd | Shown | — |
| Prototype | 3rd | Shown | — |
| Deprecated | 4th | Hidden | Shown if `alternative` is set |

If you add a new status value, update `STATUS_ORDER` in `app/page.tsx`, `STATUS_CONFIG` in `components/project-card.tsx`, and `STATUS_COLOR`/`STATUS_BG` in `app/[slug]/opengraph-image.tsx`.

### OpenGraph images

Dynamic OG images are generated at build time via `next/og` `ImageResponse`:

| File | Route |
|------|-------|
| `app/opengraph-image.tsx` | `/` (index) |
| `app/[slug]/opengraph-image.tsx` | `/<slug>` (per product) |

Next.js auto-discovers these via file conventions. **Do not** add `openGraph.images` to `app/layout.tsx` metadata — it will conflict. Colours inside OG handlers are inlined as hex (CSS variables are not available in `ImageResponse`).

### Brand & design tokens

The site is **dark-mode only** — there is no light theme or theme toggle. Design tokens are defined in `app/globals.css` and consumed via Tailwind utilities (`bg-card`, `text-primary`, `text-muted-foreground`, etc.). See `string-brand.md` for the full token reference.

Fonts are loaded via `next/font/google`:
- **Headings** — Space Grotesk (`--font-space-grotesk`)
- **Body / UI** — Montserrat (`--font-montserrat`)

---

## Dependencies

### Runtime dependencies (key packages)

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 16.2.0 | Framework — App Router, static generation, OG images |
| `react` / `react-dom` | 19.2.x | UI rendering |
| `tailwindcss` | ^4.2.0 | Utility-first CSS |
| `@vercel/analytics` | 1.6.1 | Page-view analytics |
| `lucide-react` | ^0.564.0 | Icon set |
| `class-variance-authority` | ^0.7.1 | Variant-based class composition (shadcn/ui) |
| `clsx` + `tailwind-merge` | latest | Conditional class merging |
| `@radix-ui/*` | various | Headless UI primitives (installed via shadcn/ui) |

Most `@radix-ui/*` packages are installed via the shadcn/ui setup but are not actively used by current pages — only `project-card.tsx` and `deprecated-alternative.tsx` are wired into the app.

### Dev dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `typescript` | 5.7.3 | Static typing |
| `@types/react` / `@types/react-dom` | 19.x | React type definitions |
| `@tailwindcss/postcss` | ^4.2.0 | Tailwind v4 PostCSS integration |
| `postcss` | ^8.5 | CSS processing |
| `tw-animate-css` | 1.3.3 | Animation utilities for shadcn/ui |

---

## Opportunities to Contribute

String is volunteer-run and always welcoming help. Here are the most impactful open areas:

### 🗃 Data & content
- **Add real contributor names** — `contributors` arrays in `lib/data.ts` are all currently empty (`[]`). Fill in names, roles, and initials.
- **Update aggregate metrics** — `totalProjects` in `AGGREGATE` is a manually maintained count; update it when products change status. Per-product `teacherImpact` and `volunteers` fields also need keeping current (the aggregate totals are auto-computed from them).
- **Populate Diagrams and Bingo metrics** — both products currently show "WIP / metrics coming soon".

### 🎨 UI & design
- **Prototype status badge** — the `Prototype` status exists in the type system but has no products using it yet; verify the badge renders correctly when needed.
- **Remove `styles/globals.css`** — this file is the unused shadcn-default OKLCH starter; deleting it removes confusion for future contributors.
- **Responsive polish** — the aggregate stats strip and some detail-page sections could benefit from additional mobile testing.

### 🔧 Engineering
- **Add ESLint to devDependencies** — `eslint` is referenced in the `lint` script but not yet listed in `package.json`; run `npm install -D eslint` and commit the updated `package.json`.
- **Add a product** — the data model fully supports any new String product; just add an entry to `PROJECTS` in `lib/data.ts`.
- **OG image typography** — OG images currently use the system `sans-serif` fallback. Loading Space Grotesk via a `fetch()` call in the OG handler would match the site's visual identity.

### 📋 Process
- **Review `dev.md` pending items** — a list of open decisions and TODOs is maintained in `dev.md`.

---

## Contributing

String runs entirely on volunteer effort. To join the team, visit [join.string.sg](https://join.string.sg).

For technical questions or to discuss a contribution, open an issue or pull request in this repository.
