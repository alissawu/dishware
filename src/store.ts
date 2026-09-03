import { useCallback, useEffect, useRef, useState } from 'react'
import type { Cart } from './pricing'
import { getDb, ROOM } from './firebase'

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

const CART_KEY = 'dishware-cart-v2'

function readCache(): Cart {
  try {
    const raw = localStorage.getItem(CART_KEY)
    return raw != null ? (JSON.parse(raw) as Cart) : {}
  } catch {
    return {}
  }
}
function writeCache(cart: Cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  } catch {
    /* ignore */
  }
}
function clampQty(n: number) {
  return Math.max(0, Math.min(9999, Math.floor(n) || 0))
}

export type SyncState = 'local' | 'connecting' | 'online' | 'offline'

/**
 * Shared cart. Firebase Realtime Database is the source of truth when configured;
 * localStorage is an instant-load cache + offline fallback.
 * When either device changes a quantity, the other updates live.
 */
export function useCart() {
  // Instant paint from cache; Firebase reconciles a moment later.
  const [cart, setCartState] = useState<Cart>(readCache)
  const [sync, setSync] = useState<SyncState>(() => (getDb() ? 'connecting' : 'local'))
  const dbRef = useRef(getDb())
  // The first server snapshot is reconciled against the local cache so a wiped
  // or empty server can't silently blow away a cart that still exists locally.
  const seeded = useRef(false)

  useEffect(() => {
    const db = dbRef.current
    if (!db) {
      setSync('local')
      return
    }
    let unsubValue = () => {}
    let unsubConn = () => {}
    let cancelled = false
    ;(async () => {
      const { ref, onValue, update } = await import('firebase/database')
      if (cancelled) return
      // Live cart data
      unsubValue = onValue(ref(db, `carts/${ROOM}`), (snap) => {
        const val = (snap.val() as Cart | null) || {}
        // sanitize
        const clean: Cart = {}
        for (const k of Object.keys(val)) {
          const q = clampQty(Number(val[k]))
          if (q > 0) clean[k] = q
        }

        // First snapshot only: merge with the local cache instead of trusting the
        // server blindly. This makes localStorage a true fallback — if the server
        // was wiped (deploy, stray delete, someone hitting the open DB) but this
        // device still remembers items, we restore them AND push them back up so
        // the shared cart heals. Server values win per-key conflicts.
        if (!seeded.current) {
          seeded.current = true
          const local = readCache()
          const merged: Cart = { ...local, ...clean }
          setCartState(merged)
          writeCache(merged)
          const healsServer = Object.keys(merged).some((k) => merged[k] !== clean[k])
          if (healsServer) update(ref(db, `carts/${ROOM}`), merged).catch(() => {})
          return
        }

        // After the initial reconcile, follow server truth live (including real
        // clears made during an active session).
        setCartState(clean)
        writeCache(clean)
      })
      // Connection status
      unsubConn = onValue(ref(db, '.info/connected'), (snap) => {
        setSync(snap.val() === true ? 'online' : 'offline')
      })
    })()
    return () => {
      cancelled = true
      unsubValue()
      unsubConn()
    }
  }, [])

  const setQty = useCallback((sku: string, n: number) => {
    const v = clampQty(n)
    // Optimistic local update (instant UI); Firebase onValue will reconcile.
    setCartState((c) => {
      const next = { ...c }
      if (v <= 0) delete next[sku]
      else next[sku] = v
      writeCache(next)
      return next
    })
    const db = dbRef.current
    if (db) {
      import('firebase/database').then(({ ref, set }) => {
        set(ref(db, `carts/${ROOM}/${sku}`), v > 0 ? v : null).catch(() => {})
      })
    }
  }, [])

  const clear = useCallback(() => {
    setCartState({})
    writeCache({})
    const db = dbRef.current
    if (db) {
      import('firebase/database').then(({ ref, set }) => {
        set(ref(db, `carts/${ROOM}`), null).catch(() => {})
      })
    }
  }, [])

  return { cart, setQty, clear, sync }
}
