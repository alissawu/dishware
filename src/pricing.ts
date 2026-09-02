export type Plate = {
  sku: string
  inch: string
  dims: string
  name: string
  series: string
  color: string
  price: number
  img: string
  imgFull: string
}

export type Cart = Record<string, number>

// Volume tiers from Everful: discount % applied to each unit price,
// based on TOTAL cart quantity, rounded UP to the cent (matches the site).
export type Tier = { min: number; rate: number; label: string }

export const TIERS: Tier[] = [
  { min: 0, rate: 0, label: '0–9 pcs' },
  { min: 10, rate: 2, label: '10–19 pcs' },
  { min: 20, rate: 4, label: '20–29 pcs' },
  { min: 30, rate: 6, label: '30+ pcs' },
]

export function tierFor(totalQty: number): Tier {
  let t = TIERS[0]
  for (const tier of TIERS) if (totalQty >= tier.min) t = tier
  return t
}

export function unitPrice(base: number, rate: number) {
  // ceil to the cent, e.g. 2.73 * 0.96 = 2.6208 -> 2.63
  return Math.ceil(base * (1 - rate / 100) * 100) / 100
}

export function totalQty(cart: Cart) {
  return Object.values(cart).reduce((a, b) => a + (b || 0), 0)
}

export function money(n: number) {
  return '$' + n.toFixed(2)
}
