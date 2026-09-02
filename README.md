# Everful Tableware Picker

A fast, clean picker for ordering Everful ceramics in bulk — **plates, bowls, and saucers** — with one unified running total and live volume pricing. More categories drop in easily.

Live data scraped from the Everful product pages (image, style/series, color, exact size, per-variant price):

- [Plates](https://www.everfulwholesale.com/products/elegant-glam-retro-solid-color-ceramics-tableware-1-piece) — 38 styles
- [Bowls](https://www.everfulwholesale.com/products/japanese-ceramic-retro-soup-bowl-salad-bowl-dishes-dish-bowl-ramen-bowl-large-soup-household-bowl) — 16 styles
- [Saucers](https://www.everfulwholesale.com/products/japanese-kiln-dish-ceramic-snack-dish-seasoning-dish-restaurant-hot-pot-sauce-dish-sushi-sauce-dish) — 6 styles
- [Cutting Boards](https://www.everfulwholesale.com/products/ebony-wood-cutting-board-solid-wood-durable-for-chopping-and-cutting-home-use-wooden-chopping-board-sticky-cutting-board) — 25 styles

## Features

- **Unified cart across all categories.** One grand total, savings, and piece count spanning plates, bowls and saucers. Filter by category with chips, or view All.
- **Three view densities** (Gmail-style toggle):
  - *Comfortable* — big cards, collapsible size groups.
  - *Compact* — newspaper-column layout that packs every size group and style onto the screen at a glance, tiny cards with inline steppers.
  - *List* — thin scannable rows with thumbnail, size, price, qty and line total.
- **Detail modal** — click any product photo for a large image, full specs, SKU, and a per-tier price ladder.
- **Split-screen** (desktop) — browse on the left, a live full cart on the right with pics, per-category subtotals, and the grand total. A slide-over cart drawer covers mobile.
- **Real tiered pricing.** The discount tier (2% / 4% / 6% off at 10 / 20 / 30 pieces) applies **per variant** — you unlock it by buying 10+ of the *same* style, exactly like Everful. Mixing different styles does not pool toward a discount. Unit prices round up to the cent to match the site.
- **Everything persists to localStorage** — cart, view density, split state, active category, and which groups are collapsed. A tucked-away "Clear localStorage" button in the footer wipes it all (two-tap to confirm).
- Responsive, keyboard-friendly (Esc closes modal/drawer), no jank.

## Stack

Vite + React + TypeScript + Tailwind CSS + Framer Motion.

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
npm run preview  # preview the build
```

## Data

Catalog lives in `src/catalog.json` (categories → items). Pricing math is in `src/pricing.ts`.
Adding a new category is just another entry in the catalog with its scraped items.
Images are served from Everful's CDN (`cdn.everfulwholesale.com`).

> Note on prices: variants are priced individually (plates $2.73–$6.29, bowls $2.14–$4.93,
> saucers $1.10–$1.23), taken live from each product page rather than a single flat rate.
