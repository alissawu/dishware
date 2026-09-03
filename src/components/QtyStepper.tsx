import { useEffect, useRef, useState } from 'react'

type Props = {
  value: number
  onChange: (n: number) => void
  size?: 'nano' | 'xs' | 'sm' | 'md'
  block?: boolean
}

export default function QtyStepper({ value, onChange, size = 'md', block }: Props) {
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
  const dims =
    size === 'nano'
      ? { pad: 'h-5 w-5', box: 'h-5 w-5 text-[11px]', ic: 10 }
      : size === 'xs'
      ? { pad: 'h-6 w-6', box: 'h-6 w-8 text-xs', ic: 12 }
      : size === 'sm'
      ? { pad: 'h-8 w-8', box: 'h-8 w-11 text-sm', ic: 14 }
      : { pad: 'h-9 w-9', box: 'h-9 w-12 text-base', ic: 14 }

  const boxCls = block
    ? `flex-1 min-w-0 ${size === 'md' ? 'h-9 text-base' : 'h-8 text-sm'}`
    : dims.box

  return (
    <div
      className={`items-center rounded-full border transition-colors ${block ? 'flex w-full' : 'inline-flex'} ${
        active ? 'border-clay/40 bg-clay/[0.06]' : 'border-line bg-white/60'
      }`}
    >
      <button
        type="button"
        aria-label="Decrease"
        onClick={() => commit(String(value - 1))}
        disabled={value <= 0}
        className={`${dims.pad} grid place-items-center rounded-full text-ink/70 transition
          hover:bg-clay/10 hover:text-clayDark active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent`}
      >
        <svg width={dims.ic} height={dims.ic} viewBox="0 0 14 14"><path d="M2.5 7h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
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
        className={`${boxCls} bg-transparent text-center font-medium tabular-nums text-ink outline-none placeholder:text-muted/50`}
      />
      <button
        type="button"
        aria-label="Increase"
        onClick={() => commit(String(value + 1))}
        className={`${dims.pad} grid place-items-center rounded-full text-ink/70 transition
          hover:bg-clay/10 hover:text-clayDark active:scale-90`}
      >
        <svg width={dims.ic} height={dims.ic} viewBox="0 0 14 14"><path d="M7 2.5v9M2.5 7h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
      </button>
    </div>
  )
}
