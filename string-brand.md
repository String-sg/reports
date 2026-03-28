# String Brand System

A portable reference for colors, typography, spacing, and component patterns — applicable across any String repo or product.

---

## Colors

### CSS Custom Properties

```css
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');

:root {
  /* Primary */
  --color-string-mint:         #75F8CC;  /* rgb(117, 248, 204) — primary accent */
  --color-string-mint-light:   #A8FAE0;  /* hover/lighter variant of mint */
  --color-string-mint-dark:    #2BB389;  /* pressed/darker variant of mint */
  --color-string-dark:         #33373B;  /* rgb(51, 55, 59)  — primary dark  */
  --color-string-darker:       #1A1D1F;  /* deep dark, dark-mode backgrounds */

  /* Neutrals */
  --color-string-surface:      #FFFFFF;  /* card / panel backgrounds */
  --color-string-surface-hover:#F3F4F6;  /* subtle hover on white surfaces */
  --color-string-bg:           #F9FAFB;  /* page background */
  --color-string-border:       #E5E7EB;  /* default borders */
  --color-string-gray:         #6B7280;  /* muted text / icons */

  /* Text */
  --color-string-text-primary:   #1F2937;
  --color-string-text-secondary: #4B5563;

  /* Secondary accent */
  --color-string-light:        #C0F4FB;  /* rgb(192, 244, 251) — secondary highlight */

  /* Typography */
  --font-heading: 'Space Grotesk', sans-serif;
  --font-body:    'Montserrat', sans-serif;
}
```

### Quick-reference table

| Token | Hex | Usage |
|-------|-----|-------|
| `string-mint` | `#75F8CC` | Primary CTA buttons, active states, highlights, links |
| `string-mint-light` | `#A8FAE0` | Hover state of mint elements |
| `string-mint-dark` | `#2BB389` | Pressed / deeper mint interactions |
| `string-dark` | `#33373B` | Navbar backgrounds, icon fills on mint, headings |
| `string-darker` | `#1A1D1F` | Dark-mode page backgrounds |
| `string-light` | `#C0F4FB` | Secondary accents, subtle tinted backgrounds |
| `string-surface` | `#FFFFFF` | Cards, modals, panels |
| `string-surface-hover` | `#F3F4F6` | Hover state on white surfaces |
| `string-bg` | `#F9FAFB` | Page / layout background |
| `string-border` | `#E5E7EB` | Default borders |
| `string-gray` | `#6B7280` | Muted / secondary icons and text |
| `string-text-primary` | `#1F2937` | Body copy |
| `string-text-secondary` | `#4B5563` | Captions, secondary labels |

### Tailwind 4 (`@theme` block)

```css
@theme {
  --color-string-mint:          #75f8cc;
  --color-string-mint-light:    #a8fae0;
  --color-string-mint-dark:     #2bb389;
  --color-string-dark:          #33373b;
  --color-string-darker:        #1a1d1f;
  --color-string-light:         #c0f4fb;
  --color-string-surface:       #ffffff;
  --color-string-surface-hover: #f3f4f6;
  --color-string-bg:            #f9fafb;
  --color-string-border:        #e5e7eb;
  --color-string-gray:          #6b7280;
  --color-string-text-primary:  #1f2937;
  --color-string-text-secondary:#4b5563;
  --font-family-heading: 'Space Grotesk', sans-serif;
  --font-family-body:    'Montserrat', sans-serif;
}
```

---

## Typography

### Fonts

| Role | Family | Weights | Import |
|------|--------|---------|--------|
| Headings (`h1`–`h6`) | **Space Grotesk** | 400, 500, 600, 700 | Google Fonts |
| Body / UI text | **Montserrat** | 400, 500, 600, 700 | Google Fonts |

```html
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Scale

| Role | Size | Weight | Class (Tailwind) |
|------|------|--------|-----------------|
| Display / Hero | 30px | 700 | `text-3xl font-bold` |
| Page heading | 20px | 600 | `text-xl font-semibold` |
| Section heading | 18px | 500 | `text-lg font-medium` |
| Body | 14–16px | 400 | `text-sm` / `text-base` |
| Caption / label | 12px | 400–500 | `text-xs` |

```css
/* Baseline applied to <body> */
body {
  font-family: var(--font-body);
  background-color: var(--color-string-bg);
  color: var(--color-string-text-primary);
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
}
```

---

## Spacing & Layout

| Concept | Value | Tailwind |
|---------|-------|---------|
| Container (default) | 896px | `max-w-4xl` |
| Container (wide) | 1280px | `max-w-7xl` |
| Section gap | 24–32px | `space-y-6` / `space-y-8` |
| Card padding (default) | 24px | `p-6` |
| Card padding (large) | 32px | `p-8` |
| Button padding (sm) | 12px × 6px | `px-3 py-1.5` |
| Button padding (md) | 16px × 8px | `px-4 py-2` |
| Button padding (lg) | 24px × 12px | `px-6 py-3` |
| Grid gap | 24px | `gap-6` |

---

## Border Radius

| Element | Radius | Tailwind |
|---------|--------|---------|
| Cards, buttons | 12px | `rounded-xl` |
| Small elements (icon buttons, badges) | 8px | `rounded-lg` |
| Avatars | 16px | `rounded-2xl` |
| Pills / tags | 9999px | `rounded-full` |

---

## Shadows

| Usage | Class |
|-------|-------|
| Default card | `shadow-sm` |
| Hovered / elevated card | `shadow-md` |

---

## Interactive States

| State | Pattern |
|-------|---------|
| Default border | `border border-gray-100` |
| Hover border | `hover:border-string-mint` |
| Active / selected | `border-string-mint text-string-mint` |
| Transition | `transition-colors` or `transition-all duration-200` |
| Disabled | `disabled:opacity-50` |

---

## Component Patterns

### Button

Three variants, three sizes. Always prefer the abstracted component over inline classes.

```
variant   | background              | text            | hover
--------- | ----------------------- | --------------- | -------------------------
primary   | string-mint             | string-dark     | string-mint-light
secondary | white + border-gray-200 | string-dark     | gray-50
text      | transparent             | string-mint     | string-mint-light (text)
```

```css
/* Base */
font-medium transition-colors rounded-xl inline-flex items-center justify-center

/* Sizes */
sm → px-3 py-1.5 text-sm
md → px-4 py-2   text-sm
lg → px-6 py-3   text-base
```

### Card

```css
/* Base */
bg-white rounded-xl border border-gray-100 transition-colors

/* With hover */
hover:border-string-mint cursor-pointer hover:shadow-md
```

### App Card

```css
group bg-white rounded-xl p-6 shadow-sm border border-gray-100
hover:border-string-mint hover:shadow-md transition-all duration-200 cursor-pointer
```

- Icon container: `w-12 h-12 rounded-xl bg-string-dark text-string-mint`
- Icon fallback: first 2 initials, uppercase
- Hover reveal launch icon: `opacity-0 group-hover:opacity-100`

### Icon Button

```css
rounded-lg flex items-center justify-center transition-all
text-gray-400 hover:bg-string-mint hover:text-string-dark

sm → w-6 h-6  (icon: w-3 h-3)
md → w-8 h-8  (icon: w-4 h-4)
lg → w-10 h-10 (icon: w-5 h-5)
```

### Badge / Pill

```css
px-3 py-1 rounded-full bg-string-mint/10 text-string-dark text-xs font-medium
```

### Navbar / Header

```css
bg-string-dark border-b border-gray-700
/* Title */
text-lg font-semibold text-string-mint
```

### Modal

```css
/* Backdrop */
fixed inset-0 bg-black/50 flex items-center justify-center z-50

/* Panel */
bg-white rounded-xl shadow-xl w-full

sm  → max-w-md
md  → max-w-lg
lg  → max-w-2xl
xl  → max-w-4xl
```

### Avatar / Initials Fallback

```css
w-20 h-20 rounded-2xl bg-string-dark text-string-mint font-semibold
/* or with image */
w-20 h-20 rounded-2xl object-cover
```

---

## Dark Mode

Apply via `.dark` class on `<body>` or a parent wrapper.

```css
.dark body,
body.dark {
  background-color: var(--color-string-darker); /* #1A1D1F */
  color: #F0F0F0;
}
```

Theme helper pattern (React / TypeScript):

```ts
const t = (light: string, dark: string) => isDark ? dark : light;

// Usage
className={`${t('bg-white', 'bg-string-dark')} ${t('text-string-dark', 'text-white')}`}
```

---

## Do / Don't

| Do | Don't |
|----|-------|
| Use `string-mint` / `string-dark` tokens | Hardcode `#75F8CC` or `#33373B` directly |
| Use `rounded-xl` for buttons and cards | Mix arbitrary radii (`rounded-md`, `rounded-3xl`) |
| Use `transition-colors` on interactive elements | Skip transitions on hover states |
| Use `e.stopPropagation()` in nested buttons | Allow click events to bubble unexpectedly |
| Use `Space Grotesk` for all headings | Use system fonts or other typefaces for headings |
| Include `rel="noopener noreferrer"` on external links | Open external URLs without security attributes |
| Use `shadow-sm` at rest, `shadow-md` on hover | Apply heavy shadows by default |
