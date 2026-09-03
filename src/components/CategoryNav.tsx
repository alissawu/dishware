import { useEffect, useRef, useState } from 'react'
import type { Category } from '../pricing'

type Props = {
  categories: Category[]
  active: string
  countFor: (id: string) => number
  onSelect: (id: string) => void
}

function Count({ n, variant = 'accent' }: { n: number; variant?: 'accent' | 'muted' | 'onDark' }) {
  const cls =
    variant === 'onDark' ? 'bg-paper/20 text-paper'
    : variant === 'muted' ? 'bg-ink/[0.08] text-ink/70'
    : 'bg-clay text-paper'
  return (
    <span className={`grid h-[1.05rem] min-w-[1.05rem] place-items-center rounded-full px-1 text-[10px] font-semibold leading-none tabular-nums ${cls}`}>
      {n}
    </span>
  )
}

export default function CategoryNav({ categories, active, countFor, onSelect }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const items = [{ id: 'all', label: 'All' }, ...categories.map((c) => ({ id: c.id, label: c.label }))]
  const current = items.find((i) => i.id === active) ?? items[0]

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onEsc)
    }
  }, [open])

  return (
    <>
      {/* mobile: single dropdown, no horizontal scroll */}
      <div ref={ref} className="relative sm:hidden">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-2 rounded-full border border-ink/15 bg-white px-4 py-3 text-sm text-ink shadow-sm transition-colors active:bg-ink/[0.03]"
        >
          <span className="flex items-center gap-2">
            <svg width="15" height="15" viewBox="0 0 16 16" className="text-muted" aria-hidden><path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <span className="font-semibold">{current.label}</span>
            {countFor(current.id) > 0 && <Count n={countFor(current.id)} />}
          </span>
          <svg
            className={`text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            width="14" height="14" viewBox="0 0 16 16" aria-hidden
          >
            <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {open && (
          <div
            role="listbox"
            className="absolute left-0 right-0 top-full z-40 mt-2 max-h-[62vh] overflow-auto rounded-2xl border border-ink/15 bg-white p-1.5 shadow-lift"
          >
            {items.map((it) => {
              const q = countFor(it.id)
              const sel = it.id === active
              return (
                <button
                  key={it.id}
                  role="option"
                  aria-selected={sel}
                  onClick={() => { onSelect(it.id); setOpen(false) }}
                  className={`flex w-full items-center justify-between gap-2 rounded-xl px-3.5 py-3 text-sm transition-colors ${
                    sel ? 'bg-ink font-medium text-paper' : 'text-ink/80 active:bg-ink/[0.04]'
                  }`}
                >
                  <span>{it.label}</span>
                  {q > 0 && <Count n={q} variant={sel ? 'onDark' : 'muted'} />}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* desktop: chip row */}
      <div className="hidden items-center gap-2 overflow-x-auto sm:flex">
        {items.map((it) => {
          const q = countFor(it.id)
          const sel = it.id === active
          return (
            <button
              key={it.id}
              onClick={() => onSelect(it.id)}
              className={`flex flex-none items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-colors ${
                sel ? 'border-ink bg-ink font-medium text-paper' : 'border-ink/15 bg-white text-ink hover:border-ink/40'
              }`}
            >
              {it.label}
              {q > 0 && (
                <span
                  className={`grid h-[1.05rem] min-w-[1.05rem] place-items-center rounded-full px-1 text-[10px] font-semibold leading-none tabular-nums ${
                    sel ? 'bg-paper/20 text-paper' : 'bg-clay text-paper'
                  }`}
                >
                  {q}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </>
  )
}
