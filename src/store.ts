import { useCallback, useEffect, useState } from 'react'
import type { Cart } from './pricing'

export function usePersisted<T>(key: string, initial: T) {
  const [val, setVal] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw != null ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(val))
    } catch {
      /* ignore */
    }
  }, [key, val])
  return [val, setVal] as const
}

export function useCart() {
  const [cart, setCart] = usePersisted<Cart>('dishware-cart-v2', {})

  const setQty = useCallback(
    (sku: string, n: number) =>
      setCart((c) => {
        const next = { ...c }
        const v = Math.max(0, Math.min(9999, Math.floor(n) || 0))
        if (v <= 0) delete next[sku]
        else next[sku] = v
        return next
      }),
    [setCart]
  )

  const clear = useCallback(() => setCart({}), [setCart])

  return { cart, setQty, clear }
}
