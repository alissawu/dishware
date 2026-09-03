import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import catalogData from './catalog.json'
import type { Category, Item } from './pricing'
import { categorySummary, money } from './pricing'
import { useCart, usePersisted, type SyncState } from './store'
import CategoryBlock from './components/CategoryBlock'
import CartPanel from './components/CartPanel'
import DetailModal from './components/DetailModal'

const CATALOG = catalogData as Category[]
type Density = 'comfortable' | 'compact' | 'list'

export default function App() {
  const { cart, setQty, clear, sync } = useCart()
  const [density, setDensity] = usePersisted<Density>('dishware-density', 'comfortable')
  const [split, setSplit] = usePersisted<boolean>('dishware-split', false)
  const [active, setActive] = usePersisted<string>('dishware-cat', 'all')
  const [collapsedArr, setCollapsedArr] = usePersisted<string[]>('dishware-collapsed', [])
  const collapsed = useMemo(() => new Set(collapsedArr), [collapsedArr])
  const [modalSku, setModalSku] = useState<string | null>(null)
  const [drawer, setDrawer] = useState(false)

  const shown = active === 'all' ? CATALOG : CATALOG.filter((c) => c.id === active)

  const grand = useMemo(() => {
    let sum = 0, saved = 0, qty = 0
    for (const cat of CATALOG) {
      const s = categorySummary(cart, cat)
      sum += s.subtotal; saved += s.saved; qty += s.qty
    }
    return { sum, saved, qty }
  }, [cart])

  const toggleGroup = (key: string) =>
    setCollapsedArr((arr) => (arr.includes(key) ? arr.filter((k) => k !== key) : [...arr, key]))

  const setGroupsCollapsed = (keys: string[], collapse: boolean) =>
    setCollapsedArr((arr) =>
      collapse ? [...new Set([...arr, ...keys])] : arr.filter((k) => !keys.includes(k))
    )

  const modalItem: Item | null = modalSku
    ? CATALOG.flatMap((c) => c.items).find((i) => i.sku === modalSku) || null
    : null
  const modalCat = modalItem ? CATALOG.find((c) => c.id === modalItem.category) : undefined

  return (
    <div className="relative z-[1] min-h-screen">
      {/* header */}
      <header className="sticky top-0 z-30 border-b border-line/80 bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-4 py-2.5 sm:px-6">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl font-semibold tracking-tight text-ink">Everful</span>
            <span className="hidden text-sm text-muted sm:inline">· tableware picker</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <SyncBadge state={sync} />
            <DensityToggle value={density} onChange={setDensity} />
            <button
              onClick={() => setSplit((s) => !s)}
              className={`hidden h-8 items-center gap-1.5 rounded-full border px-3 text-sm transition-colors lg:flex ${
                split ? 'border-clay bg-clay text-paper' : 'border-line bg-card text-ink hover:border-clay/40'
              }`}
              title="Split screen with live cart"
            >
              <svg width="15" height="15" viewBox="0 0 16 16"><rect x="1.5" y="2.5" width="13" height="11" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.3"/><path d="M9.5 2.5v11" stroke="currentColor" strokeWidth="1.3"/></svg>
              Split
            </button>
            <button
              onClick={() => setDrawer(true)}
              className="relative flex h-8 items-center gap-1.5 rounded-full bg-ink px-3 text-sm font-medium text-paper transition hover:bg-ink/90"
            >
              <svg width="15" height="15" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" strokeWidth="1.3"/><circle cx="8" cy="8" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.3"/></svg>
              {money(grand.sum)}
              {grand.qty > 0 && (
                <span className="grid h-4 min-w-4 place-items-center rounded-full bg-clay px-1 text-[10px] font-semibold">{grand.qty}</span>
              )}
            </button>
          </div>
        </div>

        {/* category chips + controls */}
        <div className="mx-auto flex max-w-[1600px] items-center gap-2 overflow-x-auto px-4 pb-2 sm:px-6">
          <Chip label="All" count={grand.qty} activeChip={active === 'all'} onClick={() => setActive('all')} />
          {CATALOG.map((c) => {
            const q = categorySummary(cart, c).qty
            return <Chip key={c.id} label={c.label} count={q} activeChip={active === c.id} onClick={() => setActive(c.id)} />
          })}
        </div>
      </header>

      {/* hero — comfortable + not split only */}
      {density === 'comfortable' && !split && active === 'all' && (
        <div className="mx-auto max-w-[1600px] px-4 pt-9 sm:px-6">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-clay">Vintage glazed ceramics · wholesale</p>
          <h1 className="max-w-2xl font-display text-4xl leading-[1.05] text-ink sm:text-5xl">
            Plates, bowls & saucers,<br />one running total.
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
            Every style across all categories. Quantities update live, and volume pricing
            applies per style (2 / 4 / 6% off once you buy 10 / 20 / 30 of the same one).
          </p>
        </div>
      )}

      {/* body */}
      <div className={`mx-auto flex max-w-[1600px] gap-6 px-4 pb-40 pt-6 sm:px-6 ${split ? 'lg:pb-10' : ''}`}>
        <main className={split ? 'min-w-0 flex-1' : 'mx-auto w-full max-w-6xl'}>
          <div className={`flex flex-col ${density === 'compact' ? 'gap-3' : 'gap-8'}`}>
            {shown.map((cat) => (
              <CategoryBlock
                key={cat.id}
                category={cat}
                cart={cart}
                density={density}
                collapsed={collapsed}
                onToggleGroup={toggleGroup}
                onToggleGroups={setGroupsCollapsed}
                onQty={setQty}
                onOpen={(it) => setModalSku(it.sku)}
              />
            ))}
          </div>
          <div className="mt-10 flex flex-col items-center gap-3 border-t border-line/60 pt-5">
            <p className="text-center text-xs text-muted">
              Prices from Everful Wholesale · {sync === 'local' ? 'saved to this browser' : 'shared cart, synced live'} · {CATALOG.reduce((a, c) => a + c.items.length, 0)} styles
            </p>
            <ResetButton qty={grand.qty} onReset={clear} />
          </div>
        </main>

        {/* split cart pane */}
        {split && (
          <aside className="sticky top-[104px] hidden h-[calc(100vh-124px)] w-[380px] flex-none overflow-hidden rounded-2xl border border-line bg-paper/70 shadow-soft lg:block">
            <CartPanel categories={CATALOG} cart={cart} onQty={setQty} onOpen={(it) => setModalSku(it.sku)} onClear={clear} compactHeader />
          </aside>
        )}
      </div>

      {/* sticky bar (hidden when split on lg) */}
      <AnimatePresence>
        {grand.qty > 0 && (
          <motion.div
            initial={{ y: 120 }} animate={{ y: 0 }} exit={{ y: 120 }}
            transition={{ type: 'spring', stiffness: 420, damping: 38 }}
            className={`fixed inset-x-0 bottom-0 z-40 px-3 pb-3 sm:px-6 sm:pb-5 ${split ? 'lg:hidden' : ''}`}
          >
            <button
              onClick={() => setDrawer(true)}
              className="mx-auto flex w-full max-w-3xl items-center gap-4 rounded-2xl border border-clay/20 bg-ink px-5 py-3.5 text-left text-paper shadow-lift transition hover:bg-ink/95"
            >
              <div className="flex-none">
                <div className="text-xs text-paper/60">{grand.qty} {grand.qty === 1 ? 'piece' : 'pieces'} across {CATALOG.filter((c) => categorySummary(cart, c).qty > 0).length} categories</div>
                <div className="font-display text-2xl leading-none">{money(grand.sum)}</div>
              </div>
              <div className="flex-1 text-right text-xs text-paper/60">
                {grand.saved > 0 && <>you save <span className="font-medium text-paper">{money(grand.saved)}</span></>}
              </div>
              <span className="flex-none rounded-full bg-clay px-5 py-2.5 text-sm font-semibold text-paper">View order</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* cart drawer */}
      <AnimatePresence>
        {drawer && (
          <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={() => setDrawer(false)} />
            <motion.aside
              className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper shadow-lift"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 40 }}
            >
              <button onClick={() => setDrawer(false)} className="absolute -left-11 top-4 hidden h-9 w-9 place-items-center rounded-full bg-paper text-ink shadow-soft sm:grid" aria-label="Close">
                <svg width="16" height="16" viewBox="0 0 16 16"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
              </button>
              <CartPanel categories={CATALOG} cart={cart} onQty={setQty} onOpen={(it) => setModalSku(it.sku)} onClear={clear} />
              <div className="border-t border-line p-3">
                <a
                  href={CATALOG.find((c) => c.id === (active === 'all' ? 'plates' : active))?.url}
                  target="_blank" rel="noreferrer"
                  className="block rounded-full bg-clay py-3 text-center text-sm font-semibold text-paper transition hover:bg-clayDark"
                >
                  Order on Everful
                </a>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <DetailModal
        item={modalItem}
        category={modalCat}
        href={modalItem ? `${modalItem.src}?variant=${modalItem.sku}` : '#'}
        qty={modalItem ? cart[modalItem.sku] || 0 : 0}
        onQty={(n) => modalItem && setQty(modalItem.sku, n)}
        onClose={() => setModalSku(null)}
      />
    </div>
  )
}

function SyncBadge({ state }: { state: SyncState }) {
  if (state === 'local') return null
  const map = {
    connecting: { dot: 'bg-amber-400', text: 'Connecting…', ring: 'border-amber-300/50 text-amber-700 bg-amber-50' },
    online: { dot: 'bg-emerald-500', text: 'Live', ring: 'border-emerald-300/50 text-emerald-700 bg-emerald-50' },
    offline: { dot: 'bg-stone-400', text: 'Offline', ring: 'border-line text-muted bg-card' },
  }[state]
  return (
    <span
      className={`hidden h-8 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium sm:flex ${map.ring}`}
      title={
        state === 'online'
          ? 'Shared cart is syncing live across devices'
          : state === 'offline'
          ? 'No connection — changes save locally and sync when back online'
          : 'Connecting to the shared cart…'
      }
    >
      <span className="relative flex h-2 w-2">
        {state === 'online' && <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${map.dot} opacity-60`} />}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${map.dot}`} />
      </span>
      {map.text}
    </span>
  )
}

function ResetButton({ qty, onReset }: { qty: number; onReset: () => void }) {
  const [arming, setArming] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  const click = () => {
    if (!arming) {
      setArming(true)
      timer.current = setTimeout(() => setArming(false), 3500)
      return
    }
    if (timer.current) clearTimeout(timer.current)
    setArming(false)
    onReset()
  }

  return (
    <button
      onClick={click}
      disabled={qty === 0 && !arming}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors ${
        arming
          ? 'border-red-400 bg-red-50 text-red-600'
          : 'border-line/70 bg-transparent text-muted/70 hover:border-red-300 hover:text-red-500 disabled:opacity-40 disabled:hover:border-line/70 disabled:hover:text-muted/70'
      }`}
      title="Empty the shared cart for everyone (and clear this browser's cache)"
    >
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
        <path d="M2.5 4.5h11M6 4.5V3.2c0-.5.4-.9.9-.9h2.2c.5 0 .9.4.9.9V4.5M4 4.5l.6 8.3c0 .5.5.9 1 .9h4.8c.5 0 .9-.4 1-.9L13 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {arming ? 'Click again to clear localStorage' : 'Clear localStorage'}
    </button>
  )
}

function Chip({ label, count, activeChip, onClick }: { label: string; count: number; activeChip: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-none items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
        activeChip ? 'border-clay bg-clay text-paper' : 'border-line bg-card text-ink hover:border-clay/40'
      }`}
    >
      {label}
      {count > 0 && (
        <span className={`grid h-4 min-w-4 place-items-center rounded-full px-1 text-[10px] font-semibold ${activeChip ? 'bg-paper/25 text-paper' : 'bg-clay text-paper'}`}>
          {count}
        </span>
      )}
    </button>
  )
}

function DensityToggle({ value, onChange }: { value: Density; onChange: (d: Density) => void }) {
  const opts: { id: Density; title: string; icon: React.ReactNode }[] = [
    { id: 'comfortable', title: 'Comfortable', icon: <svg width="15" height="15" viewBox="0 0 16 16"><rect x="2" y="2" width="5" height="5" rx="1" fill="currentColor"/><rect x="9" y="2" width="5" height="5" rx="1" fill="currentColor"/><rect x="2" y="9" width="5" height="5" rx="1" fill="currentColor"/><rect x="9" y="9" width="5" height="5" rx="1" fill="currentColor"/></svg> },
    { id: 'compact', title: 'Compact', icon: <svg width="15" height="15" viewBox="0 0 16 16"><rect x="2" y="2" width="3" height="3" rx="0.6" fill="currentColor"/><rect x="6.5" y="2" width="3" height="3" rx="0.6" fill="currentColor"/><rect x="11" y="2" width="3" height="3" rx="0.6" fill="currentColor"/><rect x="2" y="6.5" width="3" height="3" rx="0.6" fill="currentColor"/><rect x="6.5" y="6.5" width="3" height="3" rx="0.6" fill="currentColor"/><rect x="11" y="6.5" width="3" height="3" rx="0.6" fill="currentColor"/><rect x="2" y="11" width="3" height="3" rx="0.6" fill="currentColor"/><rect x="6.5" y="11" width="3" height="3" rx="0.6" fill="currentColor"/><rect x="11" y="11" width="3" height="3" rx="0.6" fill="currentColor"/></svg> },
    { id: 'list', title: 'List', icon: <svg width="15" height="15" viewBox="0 0 16 16"><rect x="2" y="3" width="12" height="2" rx="1" fill="currentColor"/><rect x="2" y="7" width="12" height="2" rx="1" fill="currentColor"/><rect x="2" y="11" width="12" height="2" rx="1" fill="currentColor"/></svg> },
  ]
  return (
    <div className="flex items-center rounded-full border border-line bg-card p-0.5">
      {opts.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          title={o.title}
          aria-label={o.title}
          className={`grid h-7 w-8 place-items-center rounded-full transition-colors ${
            value === o.id ? 'bg-ink text-paper' : 'text-muted hover:text-ink'
          }`}
        >
          {o.icon}
        </button>
      ))}
    </div>
  )
}
