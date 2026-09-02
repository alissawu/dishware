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
            <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-clay px-0.5 text-[9px] font-bold text-paper">
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
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300
        ${active ? 'border-clay/45 shadow-lift' : 'border-line shadow-soft hover:-translate-y-0.5 hover:shadow-lift'}`}
    >
      {active && (
        <div className="absolute right-3 top-3 z-10 grid h-7 min-w-7 place-items-center rounded-full bg-clay px-2 text-xs font-semibold text-paper shadow">
          {qty}
        </div>
      )}
      <div className="relative aspect-square overflow-hidden bg-[#efe8db]">
        <img
          src={item.img}
          alt={`${item.name} — ${item.color}`}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/10 to-transparent" />
        <span className="pointer-events-none absolute left-3 bottom-3 rounded-full bg-paper/85 px-2 py-0.5 text-[11px] font-medium text-ink opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
          View details
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-[15px] leading-tight text-ink">{item.name}</h3>
          <ExternalLink href={href} className="mt-0.5 shrink-0" />
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
          <span className="inline-flex items-center gap-1 rounded-full bg-ink/[0.04] px-2 py-0.5 font-medium text-ink/70">
            {item.color}
          </span>
          {item.series && <span className="italic">{item.series}</span>}
        </div>
        {item.dims && item.dims !== item.color && <p className="text-xs text-muted">{item.dims}</p>}

        <div className="mt-auto flex items-end justify-between pt-2">
          <div className="leading-none">
            {discounted ? (
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-lg text-clayDark">{money(unit)}</span>
                <span className="text-xs text-muted line-through">{money(item.price)}</span>
              </div>
            ) : (
              <span className="font-display text-lg text-ink">{money(unit)}</span>
            )}
            <span className="ml-0.5 text-[11px] text-muted">/ea</span>
          </div>
          <div onClick={stop} onKeyDown={stop}>
            <QtyStepper value={qty} onChange={onQty} size="sm" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(ProductCardBase)
