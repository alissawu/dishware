import { memo } from 'react'
import type { Item } from '../pricing'
import { money } from '../pricing'
import QtyStepper from './QtyStepper'

type Props = {
  item: Item
  qty: number
  unit: number
  discounted: boolean
  onQty: (n: number) => void
  onOpen: () => void
}

function ListRowBase({ item, qty, unit, discounted, onQty, onOpen }: Props) {
  const active = qty > 0
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-2.5 py-2 transition-colors ${
        active ? 'border-clay/40 bg-clay/[0.05]' : 'border-transparent hover:bg-card'
      }`}
    >
      <button onClick={onOpen} className="relative h-12 w-12 flex-none overflow-hidden rounded-lg bg-[#efe8db]" aria-label={`View ${item.name}`}>
        <img src={item.img} alt={item.color} loading="lazy" decoding="async" className="h-full w-full object-cover" />
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="truncate text-sm font-medium text-ink">{item.name}</span>
          <span className="flex-none text-xs text-muted">{item.color}</span>
        </div>
        <div className="truncate text-xs text-muted">
          {item.dims || item.series || item.groupLabel}
        </div>
      </div>
      <div className="flex-none text-right leading-none">
        {discounted ? (
          <>
            <div className="font-display text-sm text-clayDark">{money(unit)}</div>
            <div className="text-[11px] text-muted line-through">{money(item.price)}</div>
          </>
        ) : (
          <div className="font-display text-sm text-ink">{money(unit)}</div>
        )}
      </div>
      <div className="flex-none">
        <QtyStepper value={qty} onChange={onQty} size="sm" />
      </div>
      <div className="w-16 flex-none text-right font-display text-sm tabular-nums text-ink">
        {qty > 0 ? money(unit * qty) : <span className="text-line">—</span>}
      </div>
    </div>
  )
}

export default memo(ListRowBase)
