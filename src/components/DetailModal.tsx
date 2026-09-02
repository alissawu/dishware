import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Item, Category } from '../pricing'
import { money, tierFor, unitPrice, TIERS } from '../pricing'
import QtyStepper from './QtyStepper'

type Props = {
  item: Item | null
  category: Category | undefined
  catQty: number
  qty: number
  onQty: (n: number) => void
  onClose: () => void
}

export default function DetailModal({ item, category, catQty, qty, onQty, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative z-10 flex w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-paper shadow-lift sm:rounded-3xl md:flex-row"
            initial={{ y: 40, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 40, scale: 0.98, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 360, damping: 34 }}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full bg-paper/80 text-ink shadow-soft backdrop-blur transition hover:bg-white"
            >
              <svg width="16" height="16" viewBox="0 0 16 16"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
            </button>

            <div className="relative aspect-square w-full flex-none bg-[#efe8db] md:w-1/2">
              <img src={item.imgFull} alt={`${item.name} — ${item.color}`} className="h-full w-full object-cover" />
            </div>

            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-clay">
                  {category?.label} · {item.groupLabel}
                </p>
                <h2 className="mt-1 font-display text-2xl leading-tight text-ink">{item.name}</h2>
                {item.series && <p className="mt-0.5 text-sm italic text-muted">{item.series}</p>}
              </div>

              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-y border-line py-4 text-sm">
                <div>
                  <dt className="text-xs text-muted">Color</dt>
                  <dd className="font-medium text-ink">{item.color}</dd>
                </div>
                {item.dims && (
                  <div>
                    <dt className="text-xs text-muted">Dimensions</dt>
                    <dd className="font-medium text-ink">{item.dims}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs text-muted">List price</dt>
                  <dd className="font-medium text-ink">{money(item.price)} ea</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">SKU</dt>
                  <dd className="font-medium text-ink">{item.sku}</dd>
                </div>
              </dl>

              {/* tier ladder for this item */}
              <div>
                <p className="mb-2 text-xs font-medium text-muted">Volume price (per {category?.label.toLowerCase()})</p>
                <div className="flex flex-wrap gap-1.5">
                  {TIERS.map((t) => {
                    const on = tierFor(catQty).min === t.min
                    return (
                      <div key={t.min} className={`rounded-lg border px-2.5 py-1.5 text-center ${on ? 'border-clay bg-clay text-paper' : 'border-line bg-card'}`}>
                        <div className={`text-[10px] ${on ? 'text-paper/80' : 'text-muted'}`}>{t.label}</div>
                        <div className="font-display text-sm">{money(unitPrice(item.price, t.rate))}</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                <span className="text-sm text-muted">Quantity in cart</span>
                <QtyStepper value={qty} onChange={onQty} size="md" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
