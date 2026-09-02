import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import platesData from './plates.json'
import type { Plate, Cart } from './pricing'
import { TIERS, tierFor, unitPrice, totalQty, money } from './pricing'
import SizeGroup from './components/SizeGroup'

const PLATES = platesData as Plate[]
const STORAGE_KEY = 'dishware-cart-v1'

// build ordered size groups
const GROUPS: { inch: string; plates: Plate[] }[] = (() => {
  const map = new Map<string, Plate[]>()
  for (const p of PLATES) {
    if (!map.has(p.inch)) map.set(p.inch, [])
    map.get(p.inch)!.push(p)
  }
  return [...map.entries()]
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([inch, plates]) => ({ inch, plates }))
})()

function loadCart(): Cart {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export default function App() {
  const [cart, setCart] = useState<Cart>(loadCart)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    () => Object.fromEntries(GROUPS.map((g) => [g.inch, true]))
  )

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  const total = totalQty(cart)
  const tier = tierFor(total)
  const rate = tier.rate

  const grand = useMemo(() => {
    let sum = 0
    let saved = 0
    for (const p of PLATES) {
      const q = cart[p.sku] || 0
      if (!q) continue
      sum += q * unitPrice(p.price, rate)
      saved += q * (p.price - unitPrice(p.price, rate))
    }
    return { sum, saved }
  }, [cart, rate])

  const setQty = (sku: string, n: number) =>
    setCart((c) => {
      const next = { ...c }
      if (n <= 0) delete next[sku]
      else next[sku] = n
      return next
    })

  const allOpen = GROUPS.every((g) => openGroups[g.inch])
  const toggleAll = () =>
    setOpenGroups(Object.fromEntries(GROUPS.map((g) => [g.inch, !allOpen])))

  const nextTier = TIERS.find((t) => t.min > total)
  const toNext = nextTier ? nextTier.min - total : 0

  return (
    <div className="relative z-[1] min-h-screen">
      {/* top bar */}
      <header className="sticky top-0 z-30 border-b border-line/80 bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl font-semibold tracking-tight text-ink">Everful</span>
            <span className="hidden text-sm text-muted sm:inline">· plate picker</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-muted sm:inline">{PLATES.length} styles</span>
            <span className="rounded-full bg-clay/[0.08] px-3 py-1 font-medium text-clayDark">
              {total} {total === 1 ? 'plate' : 'plates'}
            </span>
          </div>
        </div>
      </header>

      {/* hero */}
      <div className="mx-auto max-w-6xl px-4 pb-2 pt-10 sm:px-6 sm:pt-14">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-clay">Vintage glazed ceramics · wholesale</p>
        <h1 className="max-w-2xl font-display text-4xl leading-[1.05] text-ink sm:text-5xl">
          Build your plate order,<br />sorted by size.
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
          Every style from the Everful set, grouped by diameter. Adjust quantities and watch
          your total update live. Volume pricing kicks in automatically at 10, 20 and 30 pieces.
        </p>

        {/* tier ladder */}
        <div className="mt-7 flex flex-wrap items-stretch gap-2">
          {TIERS.map((t) => {
            const isActive = tier.min === t.min
            return (
              <div
                key={t.min}
                className={`flex flex-col rounded-xl border px-4 py-2.5 transition-all ${
                  isActive
                    ? 'border-clay bg-clay text-paper shadow-lift'
                    : 'border-line bg-card text-ink'
                }`}
              >
                <span className={`text-xs ${isActive ? 'text-paper/80' : 'text-muted'}`}>{t.label}</span>
                <span className="font-display text-sm font-medium">
                  {t.rate === 0 ? 'list price' : `${t.rate}% off`}
                </span>
              </div>
            )
          })}
        </div>
        {nextTier && (
          <p className="mt-3 text-sm text-muted">
            {total === 0 ? (
              <>Add <strong className="text-ink">{nextTier.min}</strong> plates to unlock {nextTier.rate}% off.</>
            ) : (
              <>
                <strong className="text-clayDark">{toNext} more</strong> to reach {nextTier.rate}% off
                <span className="text-muted"> ({nextTier.label}).</span>
              </>
            )}
          </p>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
          <button
            onClick={toggleAll}
            className="text-sm font-medium text-clayDark underline-offset-4 hover:underline"
          >
            {allOpen ? 'Collapse all sizes' : 'Expand all sizes'}
          </button>
          {total > 0 && (
            <button
              onClick={() => setCart({})}
              className="text-sm text-muted underline-offset-4 hover:text-clayDark hover:underline"
            >
              Clear cart
            </button>
          )}
        </div>
      </div>

      {/* size navigation pills */}
      <div className="sticky top-[57px] z-20 -mb-2 border-y border-line/70 bg-paper/70 backdrop-blur-md">
        <div className="mx-auto max-w-6xl overflow-x-auto px-4 py-2 sm:px-6">
          <div className="flex gap-2">
            {GROUPS.map((g) => {
              const c = g.plates.reduce((s, p) => s + (cart[p.sku] || 0), 0)
              return (
                <a
                  key={g.inch}
                  href={`#size-${g.inch}`}
                  className="flex flex-none items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1 text-sm text-ink transition-colors hover:border-clay/40 hover:text-clayDark"
                >
                  {g.inch}"
                  {c > 0 && (
                    <span className="grid h-4 min-w-4 place-items-center rounded-full bg-clay px-1 text-[10px] font-semibold text-paper">
                      {c}
                    </span>
                  )}
                </a>
              )
            })}
          </div>
        </div>
      </div>

      {/* groups */}
      <main className="mx-auto max-w-6xl px-4 pb-40 pt-6 sm:px-6">
        <div className="flex flex-col gap-5">
          {GROUPS.map((g) => (
            <SizeGroup
              key={g.inch}
              inch={g.inch}
              plates={g.plates}
              cart={cart}
              rate={rate}
              open={!!openGroups[g.inch]}
              onToggle={() =>
                setOpenGroups((o) => ({ ...o, [g.inch]: !o[g.inch] }))
              }
              onQty={setQty}
            />
          ))}
        </div>
        <p className="mt-10 text-center text-xs text-muted">
          Prices pulled from Everful Wholesale · your selections are saved to this browser.
        </p>
      </main>

      {/* sticky summary bar */}
      <AnimatePresence>
        {total > 0 && (
          <motion.div
            initial={{ y: 120 }}
            animate={{ y: 0 }}
            exit={{ y: 120 }}
            transition={{ type: 'spring', stiffness: 420, damping: 38 }}
            className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 sm:px-6 sm:pb-5"
          >
            <div className="mx-auto flex max-w-3xl items-center gap-4 rounded-2xl border border-clay/20 bg-ink px-5 py-3.5 text-paper shadow-lift">
              <div className="flex-none">
                <div className="text-xs text-paper/60">
                  {total} {total === 1 ? 'plate' : 'plates'}
                  {rate > 0 && <span className="ml-1 text-clay">· {rate}% off</span>}
                </div>
                <div className="font-display text-2xl leading-none">{money(grand.sum)}</div>
              </div>
              <div className="flex-1 text-right text-xs text-paper/60">
                {grand.saved > 0 ? (
                  <>you save <span className="font-medium text-paper">{money(grand.saved)}</span></>
                ) : nextTier ? (
                  <>{toNext} more for {nextTier.rate}% off</>
                ) : null}
              </div>
              <a
                href="https://www.everfulwholesale.com/products/elegant-glam-retro-solid-color-ceramics-tableware-1-piece"
                target="_blank"
                rel="noreferrer"
                className="flex-none rounded-full bg-clay px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-clayDark"
              >
                Order on Everful
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
