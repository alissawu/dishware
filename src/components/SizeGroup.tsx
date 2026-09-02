import { AnimatePresence, motion } from 'framer-motion'
import type { Plate, Cart } from '../pricing'
import { money, unitPrice } from '../pricing'
import PlateCard from './PlateCard'

type Props = {
  inch: string
  plates: Plate[]
  cart: Cart
  rate: number
  open: boolean
  onToggle: () => void
  onQty: (sku: string, n: number) => void
}

export default function SizeGroup({ inch, plates, cart, rate, open, onToggle, onQty }: Props) {
  let count = 0
  let subtotal = 0
  for (const p of plates) {
    const q = cart[p.sku] || 0
    count += q
    subtotal += q * unitPrice(p.price, rate)
  }
  const diam = plates[0]?.dims?.split('x')[0]?.trim()

  return (
    <section className="scroll-mt-24" id={`size-${inch}`}>
      <button
        onClick={onToggle}
        className="group sticky top-[68px] z-20 flex w-full items-center gap-4 rounded-xl border border-line bg-paper/85 px-4 py-3 text-left backdrop-blur-md transition-colors hover:border-clay/40"
      >
        <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-clay/30 bg-clay/[0.07] font-display text-sm font-semibold text-clayDark">
          {inch}"
        </span>
        <div className="flex-1">
          <h2 className="font-display text-lg text-ink">{inch} inch plates</h2>
          <p className="text-xs text-muted">
            {plates.length} {plates.length === 1 ? 'style' : 'styles'}
            {diam && ` · about ${diam} across`}
          </p>
        </div>
        {count > 0 && (
          <div className="hidden text-right sm:block">
            <div className="font-display text-base text-clayDark">{money(subtotal)}</div>
            <div className="text-xs text-muted">{count} in cart</div>
          </div>
        )}
        {count > 0 && (
          <span className="grid h-6 min-w-6 place-items-center rounded-full bg-clay px-1.5 text-xs font-semibold text-paper sm:hidden">
            {count}
          </span>
        )}
        <svg
          width="18" height="18" viewBox="0 0 18 18"
          className={`flex-none text-muted transition-transform duration-300 ${open ? '' : '-rotate-90'}`}
        >
          <path d="M4 6.5L9 11.5L14 6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-3 px-0.5 pb-2 pt-4 sm:grid-cols-3 lg:grid-cols-4">
              {plates.map((p) => {
                const q = cart[p.sku] || 0
                return (
                  <PlateCard
                    key={p.sku}
                    plate={p}
                    qty={q}
                    unit={unitPrice(p.price, rate)}
                    discounted={rate > 0}
                    onQty={(n) => onQty(p.sku, n)}
                  />
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
