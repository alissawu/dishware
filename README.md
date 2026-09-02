# Everful Plate Picker

A fast, clean picker for ordering the [Everful vintage glazed ceramic plate set](https://www.everfulwholesale.com/products/elegant-glam-retro-solid-color-ceramics-tableware-1-piece) in bulk. All 38 styles, grouped by diameter, with live totals and automatic volume pricing.

## Features

- **38 real variants** scraped from the Everful product page (image, style, series, color, exact size, per-variant price)
- **Grouped by inch size** (9" → 11"), each group collapsible with its own count + subtotal
- **Real tiered pricing** based on *total* cart quantity: list price, then 2% / 4% / 6% off at 10 / 20 / 30 pieces. Unit prices round up to the cent, matching Everful exactly
- **Live totals** everywhere: per-plate, per-size, and a sticky grand-total bar with savings
- **+/− steppers and direct numeric input** for every plate
- **Cart saved to localStorage** so selections survive refreshes
- Responsive, keyboard-friendly, no jank

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

Plate data lives in `src/plates.json` (38 entries). Pricing math is in `src/pricing.ts`.
Images are served from Everful's CDN (`cdn.everfulwholesale.com`).

> Note: per-variant base prices range from $2.73 to $6.29 — the original brief mentioned a
> single $4.10 tier, but the live page prices each variant individually, so those real prices
> are used here.
