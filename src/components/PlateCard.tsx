import { memo } from 'react'
import type { Plate } from '../pricing'
import { money } from '../pricing'
import QtyStepper from './QtyStepper'

type Props = {
  plate: Plate
  qty: number
  unit: number
  discounted: boolean
  onQty: (n: number) => void
}

function PlateCardBase({ plate, qty, unit, discounted, onQty }: Props) {
  const active = qty > 0
  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300
        ${active ? 'border-clay/45 shadow-lift' : 'border-line shadow-soft hover:-translate-y-0.5 hover:shadow-lift'}`}
    >
      {active && (
        <div className="absolute right-3 top-3 z-10 grid h-7 min-w-7 place-items-center rounded-full bg-clay px-2 text-xs font-semibold text-paper shadow">
          {qty}
        </div>
      )}
      <div className="relative aspect-square overflow-hidden bg-[#efe8db]">
        <img
          src={plate.img}
          alt={`${plate.name} — ${plate.color}`}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/10 to-transparent" />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-[15px] leading-tight text-ink">{plate.name}</h3>
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
          <span className="inline-flex items-center gap-1 rounded-full bg-ink/[0.04] px-2 py-0.5 font-medium text-ink/70">
            {plate.color}
          </span>
          {plate.series && <span className="italic">{plate.series}</span>}
        </div>
        <p className="text-xs text-muted">{plate.dims}</p>

        <div className="mt-auto flex items-end justify-between pt-2">
          <div className="leading-none">
            {discounted ? (
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-lg text-clayDark">{money(unit)}</span>
                <span className="text-xs text-muted line-through">{money(plate.price)}</span>
              </div>
            ) : (
              <span className="font-display text-lg text-ink">{money(unit)}</span>
            )}
            <span className="ml-0.5 text-[11px] text-muted">/ea</span>
          </div>
          <QtyStepper value={qty} onChange={onQty} size="sm" />
        </div>
      </div>
    </div>
  )
}

export default memo(PlateCardBase)
