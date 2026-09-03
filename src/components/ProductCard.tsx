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
  compact?: boolean
  onQty: (n: number) => void
  onOpen: () => void
}

const stop = (e: React.MouseEvent | React.KeyboardEvent) => e.stopPropagation()

function ExternalLink({ href, className = '' }: { href: string; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={stop}
      title="View on Everful Wholesale"
      className={`inline-grid place-items-center text-muted/70 transition-colors hover:text-clayDark ${className}`}
    >
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M6 3.25H3.75c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1h8c.55 0 1-.45 1-1V10M9.5 2.75h3.75V6.5M13 3L7.25 8.75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="sr-only">View on Everful</span>
    </a>
  )
}

function ProductCardBase({ item, qty, unit, discounted, href, compact, onQty, onOpen }: Props) {
  const active = qty > 0

  const openKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onOpen()
    }
  }

  if (compact) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={openKey}
        className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-lg border bg-card transition-all
          ${active ? 'border-clay/60 shadow-lift ring-1 ring-clay/30' : 'border-line shadow-soft hover:-translate-y-0.5 hover:shadow-lift'}`}
        title={`${item.name} · ${item.color} · ${item.groupLabel}`}
      >
        <div className="relative aspect-square overflow-hidden bg-[#efe8db]">
          <img src={item.img} alt={item.color} loading="lazy" decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]" />
          <span className={`absolute bottom-0.5 left-0.5 rounded px-1 py-px text-[9px] font-semibold leading-none backdrop-blur-sm ${discounted ? 'bg-clay/90 text-paper' : 'bg-paper/85 text-ink'}`}>
            {money(unit)}
          </span>
          {active && (
            <span className="absolute right-0.5 top-0.5 grid h-4 min-w-[1rem] place-items-center rounded-full bg-clay px-0.5 text-[9px] font-bold leading-none tabular-nums text-paper">
              {qty}
            </span>
          )}
        </div>
        <div className="flex items-center justify-center py-0.5" onClick={stop} onKeyDown={stop}>
          <QtyStepper value={qty} onChange={onQty} size="nano" />
        </div>
      </div>
    )
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={openKey}
      className="group relative flex cursor-pointer flex-col"
    >
      <div className={`relative aspect-[4/3] overflow-hidden rounded-lg bg-[#f6f3ec] shadow-[0_4px_18px_-12px_rgba(51,48,42,0.30)] transition-shadow duration-500 group-hover:shadow-[0_10px_30px_-14px_rgba(51,48,42,0.40)] sm:aspect-square ${
        active ? 'ring-1 ring-clay/35' : ''
      }`}>
        <img
          src={item.img}
          alt={`${item.name} — ${item.color}`}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        {active && (
          <div className="absolute right-2.5 top-2.5 grid h-6 min-w-[1.5rem] place-items-center rounded-full bg-ink/80 px-1.5 text-[11px] font-medium leading-none tabular-nums text-paper backdrop-blur-sm">
            {qty}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-0.5 pt-2.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-sm font-normal leading-snug text-ink sm:text-[15px]">{item.name}</h3>
          <ExternalLink href={href} className="mt-0.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <p className="mt-0.5 truncate text-xs text-muted">
          {item.color}{item.series ? ` · ${item.series}` : ''}
        </p>

        <div className="mt-2.5 flex flex-col gap-2">
          <div className="flex items-baseline gap-1.5 leading-none">
            {discounted ? (
              <>
                <span className="text-sm font-medium text-ink">{money(unit)}</span>
                <span className="text-[11px] text-muted line-through">{money(item.price)}</span>
              </>
            ) : (
              <span className="text-sm font-medium text-ink">{money(unit)}</span>
            )}
            <span className="text-[11px] text-muted">/ea</span>
          </div>
          <div onClick={stop} onKeyDown={stop}>
            <QtyStepper value={qty} onChange={onQty} size="sm" block />
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(ProductCardBase)
