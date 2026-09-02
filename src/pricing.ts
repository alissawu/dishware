export type Item = {
  sku: string
  category: string
  group: string
  groupLabel: string
  dims: string
  name: string
  series: string
  color: string
  price: number
  img: string
  imgFull: string
}

export type Category = {
  id: string
  label: string
  url: string
  groupType: 'size' | 'shape'
  items: Item[]
}

export type Cart = Record<string, number>

export type Tier = { min: number; rate: number; label: string }

// Volume tiers from Everful. On Everful each PRODUCT is billed separately, so
// the discount % is driven by that category's own quantity — not the whole cart.
export const TIERS: Tier[] = [
  { min: 0, rate: 0, label: '0–9 pcs' },
  { min: 10, rate: 2, label: '10–19 pcs' },
  { min: 20, rate: 4, label: '20–29 pcs' },
  { min: 30, rate: 6, label: '30+ pcs' },
]

export function tierFor(qty: number): Tier {
  let t = TIERS[0]
  for (const tier of TIERS) if (qty >= tier.min) t = tier
  return t
}

export function nextTier(qty: number): Tier | undefined {
  return TIERS.find((t) => t.min > qty)
}

export function unitPrice(base: number, rate: number) {
  // ceil to the cent, matches Everful (e.g. 2.73 * 0.96 = 2.6208 -> 2.63)
  return Math.ceil(base * (1 - rate / 100) * 100) / 100
}

export function money(n: number) {
  return '$' + n.toFixed(2)
}

export function catQty(cart: Cart, cat: Category) {
  return cat.items.reduce((s, it) => s + (cart[it.sku] || 0), 0)
}

// Discounts on Everful apply PER VARIANT: buying 10 of the same SKU unlocks the
// tier for that SKU only. Mixing different styles does not pool toward a discount.
export function itemUnit(item: Item, qtyOfSku: number) {
  return unitPrice(item.price, tierFor(qtyOfSku).rate)
}

// Per-category rollup: total qty, subtotal, savings, and whether any line is discounted.
export function categorySummary(cart: Cart, cat: Category) {
  let qty = 0
  let subtotal = 0
  let saved = 0
  let anyDiscount = false
  for (const it of cat.items) {
    const q = cart[it.sku] || 0
    if (!q) continue
    qty += q
    const u = itemUnit(it, q)
    subtotal += q * u
    saved += q * (it.price - u)
    if (u < it.price) anyDiscount = true
  }
  return { qty, subtotal, saved, anyDiscount }
}
