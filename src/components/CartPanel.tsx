import type { Category, Cart, Item } from '../pricing'
import { categorySummary, itemUnit, money } from '../pricing'

type Props = {
  categories: Category[]
  cart: Cart
  onQty: (sku: string, n: number) => void
  onOpen: (item: Item) => void
  onClear: () => void
  compactHeader?: boolean
}

export default function CartPanel({ categories, cart, onQty, onOpen, onClear, compactHeader }: Props) {
  const lines = categories
    .map((cat) => {
      const sum = categorySummary(cart, cat)
      const items = cat.items.filter((it) => (cart[it.sku] || 0) > 0)
      return { cat, sum, items }
    })
    .filter((l) => l.items.length > 0)

  const grand = lines.reduce((a, l) => a + l.sum.subtotal, 0)
  const saved = lines.reduce((a, l) => a + l.sum.saved, 0)
  const totalQty = lines.reduce((a, l) => a + l.sum.qty, 0)

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <h2 className={`font-display text-ink ${compactHeader ? 'text-lg' : 'text-xl'}`}>Your order</h2>
        {totalQty > 0 && (
          <button onClick={onClear} className="text-xs text-muted underline-offset-4 hover:text-clayDark hover:underline">
            Clear all
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {lines.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 py-16 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full border-2 border-dashed border-line text-muted">
              <svg width="22" height="22" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>
            </div>
            <p className="text-sm text-muted">Nothing selected yet.</p>
            <p className="text-xs text-muted">Add plates, bowls or saucers and they'll gather here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {lines.map(({ cat, sum, items }) => (
              <div key={cat.id}>
                <div className="mb-2 flex items-baseline justify-between">
                  <h3 className="font-display text-base text-ink">
                    {cat.label}
                    {sum.anyDiscount && <span className="ml-2 rounded-full bg-clay/10 px-2 py-0.5 text-[11px] font-medium text-clayDark">volume price</span>}
                  </h3>
                  <span className="text-sm text-muted">{sum.qty} · <span className="font-display text-clayDark">{money(sum.subtotal)}</span></span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {items.map((it) => {
                    const q = cart[it.sku] || 0
                    const u = itemUnit(it, q)
                    return (
                      <div key={it.sku} className="flex items-center gap-2.5 rounded-lg bg-card px-2 py-1.5">
                        <button onClick={() => onOpen(it)} className="h-10 w-10 flex-none overflow-hidden rounded-md bg-[#efe8db]">
                          <img src={it.img} alt={it.color} loading="lazy" className="h-full w-full object-cover" />
                        </button>
                        <div className="min-w-0 flex-1">
                          <a
                            href={`${it.src}?variant=${it.sku}`}
                            target="_blank"
                            rel="noreferrer"
                            className="group/link inline-flex max-w-full items-center gap-1 text-xs font-medium text-ink hover:text-clayDark"
                            title="View this item on Everful Wholesale"
                          >
                            <span className="truncate underline-offset-2 group-hover/link:underline">{it.name}</span>
                            <svg className="h-3 w-3 flex-none opacity-40 group-hover/link:opacity-100" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M14 5h5v5M19 5l-8 8M18 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </a>
                          <div className="truncate text-[11px] text-muted">{it.color} · {it.groupLabel} · {money(u)} ea</div>
                        </div>
                        <div className="flex flex-none items-center gap-1">
                          <button onClick={() => onQty(it.sku, q - 1)} className="grid h-6 w-6 place-items-center rounded-full text-ink/60 hover:bg-clay/10 hover:text-clayDark" aria-label="Decrease">
                            <svg width="12" height="12" viewBox="0 0 14 14"><path d="M2.5 7h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                          </button>
                          <span className="w-5 text-center text-xs font-medium tabular-nums">{q}</span>
                          <button onClick={() => onQty(it.sku, q + 1)} className="grid h-6 w-6 place-items-center rounded-full text-ink/60 hover:bg-clay/10 hover:text-clayDark" aria-label="Increase">
                            <svg width="12" height="12" viewBox="0 0 14 14"><path d="M7 2.5v9M2.5 7h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                          </button>
                        </div>
                        <div className="w-14 flex-none text-right font-display text-sm tabular-nums text-ink">{money(u * q)}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* totals */}
      <div className="border-t border-line bg-card/60 px-4 py-3">
        <div className="flex items-center justify-between text-sm text-muted">
          <span>{totalQty} {totalQty === 1 ? 'piece' : 'pieces'} total</span>
          {saved > 0 && <span className="text-clayDark">you save {money(saved)}</span>}
        </div>
        <div className="mt-1 flex items-baseline justify-between">
          <span className="font-display text-base text-ink">Grand total</span>
          <span className="font-display text-2xl text-ink">{money(grand)}</span>
        </div>
      </div>
    </div>
  )
}
