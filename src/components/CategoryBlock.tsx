import { AnimatePresence, motion } from 'framer-motion'
import type { Category, Cart, Item } from '../pricing'
import { categorySummary, itemUnit, money } from '../pricing'
import ProductCard from './ProductCard'
import ListRow from './ListRow'

type Density = 'comfortable' | 'compact' | 'list'

type Props = {
  category: Category
  cart: Cart
  density: Density
  collapsed: Set<string>
  onToggleGroup: (key: string) => void
  onToggleGroups: (keys: string[], collapse: boolean) => void
  onQty: (sku: string, n: number) => void
  onOpen: (item: Item) => void
}

function groupItems(cat: Category) {
  const map = new Map<string, Item[]>()
  for (const it of cat.items) {
    if (!map.has(it.group)) map.set(it.group, [])
    map.get(it.group)!.push(it)
  }
  const entries = [...map.entries()]
  if (cat.groupType === 'size') entries.sort((a, b) => Number(a[0]) - Number(b[0]))
  return entries.map(([group, items]) => ({ group, label: items[0].groupLabel, items }))
}

export default function CategoryBlock({
  category, cart, density, collapsed, onToggleGroup, onToggleGroups, onQty, onOpen,
}: Props) {
  const groups = groupItems(category)
  const sum = categorySummary(cart, category)
  const groupKeys = groups.map((g) => `${category.id}:${g.group}`)
  const allCollapsed = groupKeys.length > 0 && groupKeys.every((k) => collapsed.has(k))
  const canToggle = groups.length > 1

  return (
    <section id={`cat-${category.id}`} className="scroll-mt-24">
      {/* category banner */}
      <div className={`flex items-baseline gap-3 border-b border-line ${density === 'compact' ? 'mb-1.5 pb-1' : 'mb-5 pb-2.5'}`}>
        <h2 className={`font-display font-normal text-ink ${density === 'compact' ? 'text-lg' : 'text-2xl'}`}>{category.label}</h2>
        <span className="text-xs text-muted">{category.items.length} styles</span>
        <div className="ml-auto flex items-center gap-3">
          {sum.qty > 0 && (
            <span className="flex items-center gap-2 text-sm">
              <span className="text-muted">{sum.qty} in cart</span>
              <span className="font-display text-base text-clayDark">{money(sum.subtotal)}</span>
            </span>
          )}
          {canToggle && (
            <button
              onClick={() => onToggleGroups(groupKeys, !allCollapsed)}
              className="flex flex-none items-center gap-1 whitespace-nowrap text-xs text-muted underline-offset-4 transition-colors hover:text-ink"
              title={allCollapsed ? 'Expand all size groups' : 'Collapse all size groups'}
            >
              <svg width="11" height="11" viewBox="0 0 18 18" className={`transition-transform ${allCollapsed ? '-rotate-90' : ''}`}>
                <path d="M4 6.5L9 11.5L14 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {allCollapsed ? 'Expand all' : 'Collapse all'}
            </button>
          )}
        </div>
      </div>

      <div className={
        density === 'comfortable' ? 'flex flex-col gap-4'
        : density === 'compact' ? 'gap-3 [column-fill:balance] columns-2 lg:columns-3 xl:columns-4 [&>*]:mb-3 [&>*]:break-inside-avoid'
        : 'flex flex-col gap-3'
      }>
        {groups.map(({ group, label, items }) => {
          const key = `${category.id}:${group}`
          const isCollapsed = collapsed.has(key)
          let gCount = 0
          let gSub = 0
          for (const it of items) {
            const q = cart[it.sku] || 0
            gCount += q
            gSub += q * itemUnit(it, q)
          }

          // COMPACT: newspaper columns — each group is a self-contained block
          if (density === 'compact') {
            return (
              <div key={key} className="rounded-lg border border-line bg-card/50 p-1.5">
                <button
                  onClick={() => onToggleGroup(key)}
                  className="mb-1 flex w-full items-center gap-1.5 px-0.5 text-left"
                  title={category.groupType === 'size' ? `${group} inch` : label}
                >
                  <svg width="11" height="11" viewBox="0 0 18 18" className={`flex-none text-muted transition-transform ${isCollapsed ? '-rotate-90' : ''}`}>
                    <path d="M4 6.5L9 11.5L14 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="font-display text-xs font-semibold text-ink">
                    {category.groupType === 'size' ? `${group}"` : label}
                  </span>
                  <span className="text-[10px] text-muted">{items.length}</span>
                  {gCount > 0 && (
                    <span className="ml-auto text-[10px] font-medium text-clayDark">{gCount} · {money(gSub)}</span>
                  )}
                </button>
                {!isCollapsed && (
                  <div className="grid grid-cols-3 gap-1.5">
                    {items.map((it) => (
                      <ProductCard
                        key={it.sku}
                        item={it}
                        qty={cart[it.sku] || 0}
                        unit={itemUnit(it, cart[it.sku] || 0)}
                        discounted={(cart[it.sku] || 0) >= 10}
                        href={`${it.src}?variant=${it.sku}`}
                        compact
                        onQty={(n) => onQty(it.sku, n)}
                        onOpen={() => onOpen(it)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          }

          return (
            <div key={key}>
              {/* group header — quiet text label */}
              <button
                onClick={() => onToggleGroup(key)}
                className={`group flex w-full items-baseline gap-2 text-left ${
                  density === 'comfortable' ? 'py-1.5' : 'py-1'
                }`}
              >
                <svg width="12" height="12" viewBox="0 0 18 18" className={`flex-none self-center text-muted/70 transition-transform ${isCollapsed ? '-rotate-90' : ''}`}>
                  <path d="M4 6.5L9 11.5L14 6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h3 className={`font-display font-normal text-ink ${density === 'comfortable' ? 'text-[15px]' : 'text-sm'}`}>
                  {category.groupType === 'size' ? `${group} inch` : label}
                </h3>
                <span className="text-xs text-muted">
                  {items.length}
                  {density === 'comfortable' && category.groupType === 'size' && items[0].dims && ` · ${items[0].dims.split('x')[0].trim()}`}
                </span>
                {gCount > 0 && (
                  <span className="ml-auto text-xs text-muted">
                    {gCount} in cart · <span className="text-clayDark">{money(gSub)}</span>
                  </span>
                )}
              </button>

              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    {density === 'list' ? (
                      <div className="flex flex-col gap-0.5 pt-1.5">
                        {items.map((it) => (
                          <ListRow
                            key={it.sku}
                            item={it}
                            qty={cart[it.sku] || 0}
                            unit={itemUnit(it, cart[it.sku] || 0)}
                            discounted={(cart[it.sku] || 0) >= 10}
                            href={`${it.src}?variant=${it.sku}`}
                            onQty={(n) => onQty(it.sku, n)}
                            onOpen={() => onOpen(it)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-x-4 gap-y-7 pb-2 pt-4 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-9 lg:grid-cols-4">
                        {items.map((it) => (
                          <ProductCard
                            key={it.sku}
                            item={it}
                            qty={cart[it.sku] || 0}
                            unit={itemUnit(it, cart[it.sku] || 0)}
                            discounted={(cart[it.sku] || 0) >= 10}
                            href={`${it.src}?variant=${it.sku}`}
                            onQty={(n) => onQty(it.sku, n)}
                            onOpen={() => onOpen(it)}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}
