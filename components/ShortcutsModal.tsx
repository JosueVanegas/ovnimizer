'use client'

import { useEffect, useState } from 'react'
import { Keyboard, X } from 'lucide-react'

export const OPEN_SHORTCUTS_EVENT = 'ovni:shortcuts'

const SHORTCUTS: { keys: string[]; label: string }[] = [
  { keys: ['⌘', 'K'], label: 'Open search' },
  { keys: ['Ctrl', 'K'], label: 'Open search (Windows/Linux)' },
  { keys: ['↑', '↓'], label: 'Navigate search results' },
  { keys: ['Enter'], label: 'Open selected tool' },
  { keys: ['?'], label: 'Show this help' },
  { keys: ['Esc'], label: 'Close dialogs' },
]

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="min-w-6 rounded-md border border-border/60 bg-muted px-1.5 py-0.5 text-center text-xs font-medium">
      {children}
    </kbd>
  )
}

export function ShortcutsModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = e.target as HTMLElement | null
      const typing = el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)
      if (e.key === '?' && !typing) {
        e.preventDefault()
        setOpen((v) => !v)
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    function onOpen() {
      setOpen(true)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener(OPEN_SHORTCUTS_EVENT, onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener(OPEN_SHORTCUTS_EVENT, onOpen)
    }
  }, [])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-border/60 bg-popover shadow-2xl animate-slide-up"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <Keyboard className="h-4 w-4 text-ufo-green" />
            Keyboard shortcuts
          </h2>
          <button onClick={() => setOpen(false)} aria-label="Close" className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <ul className="divide-y divide-border/40 p-2">
          {SHORTCUTS.map((s) => (
            <li key={s.label} className="flex items-center justify-between px-2 py-2.5 text-sm">
              <span className="text-muted-foreground">{s.label}</span>
              <span className="flex items-center gap-1">
                {s.keys.map((k) => (
                  <Kbd key={k}>{k}</Kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
