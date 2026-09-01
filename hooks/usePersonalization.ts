'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  FAV_EVENT,
  RECENT_EVENT,
  readFavorites,
  readRecents,
  toggleFavorite,
} from '@/lib/tools/storage'

/** Subscribe to a localStorage-backed list that syncs across tabs and components. */
function useStoredList(read: () => string[], event: string) {
  const [list, setList] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const sync = () => setList(read())
    sync()
    setMounted(true)
    window.addEventListener(event, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(event, sync)
      window.removeEventListener('storage', sync)
    }
  }, [read, event])

  return { list, mounted }
}

export function useFavorites() {
  const { list, mounted } = useStoredList(readFavorites, FAV_EVENT)
  const toggle = useCallback((slug: string) => toggleFavorite(slug), [])
  const isFavorite = useCallback((slug: string) => list.includes(slug), [list])
  return { favorites: list, isFavorite, toggle, mounted }
}

export function useRecents() {
  const { list, mounted } = useStoredList(readRecents, RECENT_EVENT)
  return { recents: list, mounted }
}
