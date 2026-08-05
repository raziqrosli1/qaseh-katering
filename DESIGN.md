# Selera Catering Ops — Design Specification

> **Scope:** This document covers the **visual / front-end design** only — the design system, layout,
> components, and interaction styling used across the dashboard and the customer landing page.
> It is a design reference, not an engineering guide.

Selera Catering Ops is a **premium, minimalist SaaS** for a mid-size catering business in the Klang Valley.
The aesthetic is calm, monochrome-first, with **meaningful accent colour used only to communicate data**.
Two surfaces share one design language:

1. **Operations dashboard** (`dashboard.html`, `orders.html`, `calendar.html`, `customers.html`,
   `invoices.html`, `payments.html`, `staff.html`, `reports.html`, `settings.html`)
2. **Customer landing page** (`index.html`)

---

## 1. Design Principles

- **Monochrome base, colour with meaning.** The interface is black / white / grey. Colour appears only
  when it carries information (status, finance, growth). Never decorative.
- **Calm density.** Generous whitespace, soft shadows, large rounded corners — feels expensive, not busy.
- **One glance = understanding.** KPIs, badges, and charts communicate business health instantly.
- **Consistency over novelty.** Same tokens, spacing, radii, and components everywhere.
- **Motion is subtle.** Entrance reveals, smooth easing, gentle hover lifts — never flashy.

---

## 2. Colour System

### 2.1 Neutral palette (the foundation)

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#0A0A0A` | Primary text, active nav, primary buttons |
| `--ink-2` | `#141414` | Hover state of ink surfaces |
| `--ink-soft` | `#2A2A2A` | Strong secondary text / icons |
| `--graphite` | `#5E5E5E` | Body / label text |
| `--mist` | `#8E8E8E` | Muted labels, sublabels |
| `--faint` | `#B4B4B4` | Hints, captions, axis labels |
| `--line` | `#ECECEC` | Borders, gridlines |
| `--line-2` | `#E2E2E2` | Stronger borders, dashed dividers |
| `--panel` | `#FFFFFF` | Card / surface background |
| `--bg` | `#F6F6F6` | App background |
| `--bg-soft` | `#FAFAFA` | Inset tiles, hover fills |
| `--chip` / `--chip-2` | `#F1F1F1` / `#EAEAEA` | Pills, subtle chips |

### 2.2 Semantic (data) palette — **only for meaning**

| Colour | Hex | Meaning |
|---|---|---|
| 🟢 Green | `#16A34A` | Completed · paid · positive growth · above target |
| 🔴 Red | `#DC2626` | Cancelled · overdue · negative growth · below target |
| 🟠 Orange | `#F97316` | Preparing · in progress · below average |
| 🔵 Blue | `#2563EB` | Confirmed · stable · informational |
| 🟣 Purple | `#7C3AED` | Revenue / financial insights · premium packages |
| 🟡 Amber/Yellow | `#EAB308` / `#F59E0B` | Pending · awaiting · warning |
| 🩵 Cyan | `#06B6D4` | Average order value · secondary metric |
| ⚪ Grey | `#9A9A9A` | Basic / neutral / “others” |

**Rule of thumb:** if a colour is on screen, it should map to one of the meanings above.

---

## 3. Typography

- **Typeface:** `Poppins` (Google Fonts), weights 300–700. System sans fallback.
- **Numeric:** `font-variant-numeric: tabular-nums` + tight letter-spacing (`.num`) so figures align.
- **Base body:** 13px / line-height 1.5, colour `--ink`.

| Role | Size | Weight | Notes |
|---|---|---|---|
| Page title (topbar `h1`) | 20px | 600 | letter-spacing −.03em |
| Landing hero `h1` | 50px | 600 | −.04em; one word in purple→blue gradient |
| Section heading (`.lp-h2`) | 32px | 600 | −.03em |
| KPI value | 25px | 600 | single-line, `--ink` |
| Card title | 13.5px | 600 | |
| Body / label | 12–13px | 400–500 | `--graphite` |
| Micro-label (`.mono-label`, caps) | 10.5px | 500 | letter-spacing .09em, uppercase, `--mist` |
| Nav caption | 9.5px | 600 | .12em tracking, uppercase, `--faint` |

---

## 4. Spacing, Radius, Shadow, Motion

- **Radius scale:** `--r-lg 20px`, `--r-md 16px`, `--r-sm 12px`, `--r-xs 9px`. Buttons 11–13px, pills 20px.
- **Card padding:** 18–24px. Section gap on dashboard: 22px. Content padding: 26px 32px.
- **Shadows (layered, soft):**
  - `--shadow-sm` — resting cards
  - `--shadow-md` — hover lift
  - `--shadow-lg` — floating elements (FAB, toast)
  - `--shadow-xl` — drawers & modals
- **Easing:** `cubic-bezier(.22,1,.36,1)` everywhere (the “premium” ease).
- **Motion vocabulary:**
  - `.reveal` — fade + 10px rise on load (staggered for KPI cards)
  - Line/area charts — stroke draw-on animation (~1.1–1.4s)
  - Bars — grow up from baseline (staggered)
  - Donut — segments scale + fade in (staggered)
  - Gauge ring — dash-offset sweep
  - Hover — 1–2px translateY lift, shadow deepen
- **Accessibility:** `prefers-reduced-motion` disables all animation.

---

## 5. App Shell (dashboard)

**Two-column grid:** fixed sidebar `248px` + fluid main.

### 5.1 Sidebar
- Sticky, full height, white panel, right border.
- **Brand** — black rounded logo tile + “Selera / Catering Ops”.
- **Grouped nav** with captions: *Overview · Finance · Operations*.
- Nav item: icon + label + optional count badge; hover = soft fill + icon nudge; **active = solid black pill** with soft shadow.
- **Footer user card** with avatar, name, role, green online dot.
- **Collapsible:** toggles to a `74px` icon-only rail (labels/captions hidden, badges become corner dots, today circle preserved). Preference saved; a circular date badge and tooltips keep it usable.

### 5.2 Topbar (sticky, frosted blur)
- **Left group:** panel toggle button + greeting (`Good morning/afternoon/evening, {name}`) with optional subtitle.
- **Right group:** global search (opens Command Palette) → **boxed date chip** (calendar icon + `Mon, 3 Aug 2026`) → notifications bell (red ping) → avatar.
- All right-side controls share the same 40px boxed height for a tidy row.

---

## 6. Core Components

### 6.1 Cards
White panel, 1px `--line` border, `--r-md` radius, `--shadow-sm`. `.hover` variant lifts −2px with `--shadow-md`.

### 6.2 KPI card
Icon tile (top-left) + trend pill (top-right) + big value + label, with a **coloured mini-sparkline** bleeding along the bottom (behind text, low opacity). Each metric owns a colour:
Revenue → purple · Orders → blue · Events → orange · Pending payment → red · Repeat customers → green · Avg order value → cyan.
Values are forced single-line so labels align across all six cards. Whole card is clickable → related page.

### 6.3 Trend indicator (`.trend`)
Rounded pill with directional chevron. **Up = green tint / down = red tint / flat = grey.** e.g. `▲ +18.4%`, `▼ −6.1%`.

### 6.4 Status badges (`.badge-s`)
Pill with a leading dot; **soft colour-tint background + darker text of the same hue**:

| Badge | Colour |
|---|---|
| Completed / Paid | green |
| Confirmed | blue |
| Preparing | orange |
| Pending | amber |
| Cancelled / Overdue / Unpaid | red |
| Partial / Deposit | amber |
| Refunded | grey |

Inside tables, badges get a **min-width and centred text** so columns line up regardless of label length. Pax chips are likewise fixed-width and centred.

### 6.5 Buttons
- `.btn` — white, bordered, 11px radius.
- `.btn-primary` — solid black / white text.
- `.btn-danger` — red outline.
- `.btn-wa` — WhatsApp green (`#1FA855`) on the landing page.
- Sizes: `.btn-sm`, `.btn-lg`, `.btn-block`. Active state scales to .98.

### 6.6 Toolbar / filters
Row of `.field` (search with icon), `.select` (custom chevron dropdowns), and date field — all sharing the boxed input style with a focus ring (`0 0 0 4px rgba(10,10,10,.04)`).

### 6.7 Pagination, result counts, empty states
- `.pager` — page buttons, active = black.
- **Empty state** — centred icon tile + title + one-line hint (shown whenever filters return nothing).

### 6.8 Tabs & segmented control
Inset grey track; **active segment = solid black, white text** (Sales-trend range 30D/90D/1Y, calendar Month/Week/Day).

---

## 7. Overlays

- **Right drawer** (`min(560px, 94vw)`): frosted scrim, slides in with premium ease. Header (title + subtitle + close), scrolling body of `.d-sec` blocks, sticky footer of actions. Used for **order details, customer profile, staff profile, notifications, AI assistant**.
- **Centre modal** (`min(720px, 96vw)`): scales + fades in. Used for **invoice / receipt preview** and detail dialogs.
- **Toast:** bottom-centre black pill with green check; auto-dismiss.
- **Scrim** only intercepts clicks while an overlay is open (`pointer-events` gated) so the UI never “locks”.

---

## 8. Calendar (Notion-style)

- Larger cells (`~100px`), transparent background, hairline borders, soft hover.
- **Date number** is a small element; **today** = tinted cell + inner black ring + black circular date + a tiny `TODAY` tag (clearly distinct without a heavy black fill).
- Events render as **coloured chips** (status colour + label), max 2 per cell then `+N more` — replaces hard-to-see dots.
- Generous spacing between the date and the first chip.
- **Month summary strip** (events · guests · booked revenue · confirmed) + **Today** jump button.
- Views: **Month / Week / Day**; right rail shows **Today’s schedule** timeline + **Upcoming events**.
- Legend: Confirmed (blue) · Preparing (orange) · Pending (amber) · Completed (green).

---

## 9. Data Visualisation

All charts are hand-built SVG, colour-coded by meaning, animated on entrance, with subtle dark tooltips.

- **Sales trend (line):** smooth curve with a **gradient stroke that shifts green (up) / amber (dip) / red (significant drop)**, soft green area fill, animated **peak marker**, hover crosshair. Range toggle swaps the dataset.
- **Order status (donut):** Completed green · Confirmed blue · Preparing orange · Pending yellow; centre total; legend as **boxed tiles** showing count + %.
- **Revenue by package / event (pie):** premium accent colours; legend tiles show **% + RM value**.
- **Monthly / yearly revenue (bars):** rounded bars auto-coloured by performance — current month purple, above-average green, below-average orange, lowest red.
- **Weekly orders (area):** blue gradient fill with point markers.
- **KPI sparklines:** per-metric coloured mini gradient lines.
- **Monthly target (gauge):** animated progress ring (purple) showing % of goal.
- **Consistency:** every chart uses a **left gutter** for right-aligned axis labels and light gridlines, so labels never overlap the plot.

---

## 10. AI Assistant & Command Palette (high-end touches)

- **Command Palette** (Ctrl/⌘+K or click search): centred spotlight, fuzzy search across orders / customers / invoices / pages, keyboard navigation, grouped results.
- **AI Assistant (“Ask AI”)**: floating black pill FAB (bottom-right, sparkle icon). Opens a chat drawer with greeting, suggestion chips, typing indicator, and chat bubbles (user = black, bot = white) — answers business questions from the data.

---

## 11. Customer Landing Page (`index.html`)

Same tokens and fonts, but a **centred marketing layout** (`max-width 1140px`).

- **Sticky nav** — brand, links, “Staff login”, “Get a quote”. Gains background + shadow on scroll.
- **Hero** — oversized headline with a purple→blue gradient word, dual CTA (Plan my event / WhatsApp), trust stats, and a floating **“sample quote” card**.
- **Trust band** — 4 stat tiles.
- **Packages** — card grid from real package data; each shows tier bar, **“From RM X / pax”**, feature list with green checks, and a Select button; “Most popular” gets a black highlight + badge.
- **Signature dishes** — 4 tiles with emoji icons.
- **How it works** — 3 numbered steps.
- **Estimate calculator + enquiry** — a **dark rounded panel**: pick package, pax, toggleable add-ons → live ballpark; enquiry form + WhatsApp CTAs. Estimates are **indicative only** (positions Selera on value + custom quote, not price war).
- **Testimonials** — 3 review cards with star rows.
- **CTA band** — purple→blue gradient banner.
- **Footer** — brand, links, contact, dashboard link.
- **Green WhatsApp buttons** with auto-filled messages throughout.

---

## 12. Responsive Behaviour

- **≤1240px:** KPIs 6→3 cols; chart bento reflows to 6-col; tri-grids → 2 cols; settings nav becomes horizontal.
- **≤980px:** sidebar hides; grids collapse to single column; search narrows; landing hero, packages, steps, testimonials stack.
- **≤1120px:** topbar date chip hides to avoid crowding.
- Tables scroll horizontally within their card (`overflow-x:auto`).
- **Scrollbar gutter is always reserved** (`scrollbar-gutter: stable`) so horizontal padding never shifts between pages.

---

## 13. Design Do’s & Don’ts

**Do**
- Reuse tokens and existing components.
- Use accent colour only to encode status / finance / performance.
- Keep values single-line; align badges and figures.
- Prefer soft shadows and large radii; animate with the shared ease.

**Don’t**
- Introduce new random colours or gradients without a data meaning.
- Fill whole calendar cells with black or use tiny low-contrast dots.
- Let axis labels overlap chart plots.
- Add heavy borders or hard drop shadows.

---

*Selera Catering Ops — demo design system. Monochrome base, colour with meaning, calm premium density.*
