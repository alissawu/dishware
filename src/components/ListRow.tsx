import { memo } from 'react'
import type { Item } from '../pricing'
import { money } from '../pricing'
import QtyStepper from './QtyStepper'

type Props = {
  item: Item
  qty: number
  unit: number
  discounted: boolean
  href: string
  onQty: (n: number) => void
  onOpen: () => void
}

const stop = (e: React.MouseEvent | React.KeyboardEvent) => e.stopPropagation()

function ListRowBase({ item, qty, unit, discounted, href, onQty, onOpen }: Props) {
  const active = qty > 0
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen() } }}
      className={`group flex cursor-pointer items-center gap-3 rounded-xl border px-2.5 py-2 transition-colors ${
        active ? 'border-clay/40 bg-clay/[0.05]' : 'border-transparent hover:bg-card'
      }`}
    >
      <div className="relative h-12 w-12 flex-none overflow-hidden rounded-lg bg-[#efe8db]">
        <img src={item.img} alt={item.color} loading="lazy" decoding="async" className="h-full w-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="truncate text-sm font-medium text-ink">{item.name}</span>
          <span className="flex-none text-xs text-muted">{item.color}</span>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            onClick={stop}
            title="View on Everful Wholesale"
            className="flex-none text-muted/60 opacity-0 transition-opacity hover:text-clayDark group-hover:opacity-100"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M6 3.25H3.75c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1h8c.55 0 1-.45 1-1V10M9.5 2.75h3.75V6.5M13 3L7.25 8.75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
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
      <div className="flex-none" onClick={stop} onKeyDown={stop}>
        <QtyStepper value={qty} onChange={onQty} size="sm" />
      </div>
      <div className="w-16 flex-none text-right font-display text-sm tabular-nums text-ink">
        {qty > 0 ? money(unit * qty) : <span className="text-line">—</span>}
      </div>
    </div>
  )
}

export default memo(ListRowBase)
