// Client-only personalization storage (favorites + recently used).
// All functions are safe to import anywhere but no-op during SSR.

export const FAV_KEY = 'ovni:favorites'
export const RECENT_KEY = 'ovni:recents'
export const FAV_EVENT = 'ovni:favorites'
export const RECENT_EVENT = 'ovni:recents'
const MAX_RECENTS = 8

function read(key: string): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(key)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === 'string') : []
  } catch {
    return []
  }
}

function write(key: string, value: string[], event: string) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    window.dispatchEvent(new Event(event))
  } catch {
    /* storage full or blocked — ignore */
  }
}

export function readFavorites(): string[] {
  return read(FAV_KEY)
}

export function toggleFavorite(slug: string): string[] {
  const cur = read(FAV_KEY)
  const next = cur.includes(slug) ? cur.filter((s) => s !== slug) : [slug, ...cur]
  write(FAV_KEY, next, FAV_EVENT)
  return next
}

export function readRecents(): string[] {
  return read(RECENT_KEY)
}

export function recordRecent(slug: string) {
  const next = [slug, ...read(RECENT_KEY).filter((s) => s !== slug)].slice(0, MAX_RECENTS)
  write(RECENT_KEY, next, RECENT_EVENT)
}
