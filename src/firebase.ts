// Firebase Realtime Database — shared cart sync.
// Public config is fine here: this is a personal tool and DB rules are open by design.
// Config is injected at build via Vite env (see .env / firebase-config.ts fallback).
import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getDatabase, type Database } from 'firebase/database'
import { firebaseConfig } from './firebase-config'

let app: FirebaseApp | null = null
let db: Database | null = null

export function getDb(): Database | null {
  if (db) return db
  // Only initialize if we have a real config (apiKey + databaseURL present)
  if (!firebaseConfig.apiKey || !firebaseConfig.databaseURL) return null
  try {
    app = initializeApp(firebaseConfig)
    db = getDatabase(app)
    return db
  } catch {
    return null
  }
}

// Which shared cart to sync. Everyone using this tool shares one room.
export const ROOM = 'shared'
