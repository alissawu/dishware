import { useEffect, useRef, useState } from 'react'

type Props = {
  value: number
  onChange: (n: number) => void
  size?: 'sm' | 'md'
}

export default function QtyStepper({ value, onChange, size = 'md' }: Props) {
  const [draft, setDraft] = useState(String(value || ''))
  const focused = useRef(false)

  useEffect(() => {
    if (!focused.current) setDraft(value ? String(value) : '')
  }, [value])

  const commit = (raw: string) => {
    const n = Math.max(0, Math.min(9999, Math.floor(Number(raw) || 0)))
    onChange(n)
    setDraft(n ? String(n) : '')
  }

  const active = value > 0
  const pad = size === 'sm' ? 'h-8 w-8' : 'h-9 w-9'
  const box = size === 'sm' ? 'h-8 w-11 text-sm' : 'h-9 w-12'

  return (
    <div
      className={`inline-flex items-center rounded-full border transition-colors ${
        active ? 'border-clay/40 bg-clay/[0.06]' : 'border-line bg-white/60'
      }`}
    >
      <button
        type="button"
        aria-label="Decrease"
        onClick={() => commit(String(value - 1))}
        disabled={value <= 0}
        className={`${pad} grid place-items-center rounded-full text-ink/70 transition
          hover:bg-clay/10 hover:text-clayDark active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2.5 7h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
      </button>
      <input
        inputMode="numeric"
        aria-label="Quantity"
        value={draft}
        placeholder="0"
        onFocus={(e) => { focused.current = true; e.target.select() }}
        onBlur={(e) => { focused.current = false; commit(e.target.value) }}
        onChange={(e) => setDraft(e.target.value.replace(/[^\d]/g, ''))}
        onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
        className={`${box} bg-transparent text-center font-medium tabular-nums text-ink outline-none placeholder:text-muted/50`}
      />
      <button
        type="button"
        aria-label="Increase"
        onClick={() => commit(String(value + 1))}
        className={`${pad} grid place-items-center rounded-full text-ink/70 transition
          hover:bg-clay/10 hover:text-clayDark active:scale-90`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 2.5v9M2.5 7h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
      </button>
    </div>
  )
}
