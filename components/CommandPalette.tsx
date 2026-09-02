'use client'

import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { Search, CornerDownLeft, ArrowUp, ArrowDown } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { searchTools, CATEGORY_MAP } from '@/lib/tools/registry'

export const OPEN_COMMAND_EVENT = 'ovni:command'

export function CommandPalette() {
  const router = useRouter()
  const tc = useTranslations('common')
  const tt = useTranslations('t')
  const tCat = useTranslations('cat')
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => searchTools(query).slice(0, 24), [query])

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
    setActive(0)
  }, [])

  const go = useCallback(
    (href: string, status: string) => {
      if (status !== 'ready') return
      close()
      router.push(href)
    },
    [router, close],
  )

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
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
    window.addEventListener(OPEN_COMMAND_EVENT, onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener(OPEN_COMMAND_EVENT, onOpen)
    }
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 0)
  }, [open])

  useEffect(() => {
    setActive(0)
  }, [query])

  function onListKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const tool = results[active]
      if (tool) go(tool.href, tool.status)
    }
  }

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-idx="${active}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [active])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center bg-black/50 p-4 pt-[12vh] backdrop-blur-sm"
      onMouseDown={close}
      role="dialog"
      aria-modal="true"
      aria-label={tc('searchTools')}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-border/60 bg-popover shadow-2xl animate-slide-up"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onListKey}
      >
        <div className="flex items-center gap-2.5 border-b border-border/50 px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tc('searchPlaceholder')}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
          />
          <kbd className="rounded border border-border/60 px-1.5 py-0.5 text-[10px] text-muted-foreground">ESC</kbd>
        </div>

        <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">{tc('noToolsFound')}</p>
          ) : (
            results.map((tool, i) => {
              const Icon = tool.icon
              const activeRow = i === active
              const soon = tool.status === 'soon'
              return (
                <button
                  key={tool.slug}
                  data-idx={i}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(tool.href, tool.status)}
                  disabled={soon}
                  className={[
                    'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
                    activeRow ? 'bg-ufo-green/10' : 'hover:bg-muted/50',
                    soon ? 'cursor-not-allowed opacity-60' : '',
                  ].join(' ')}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{tt(`${tool.slug}.title`)}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {tCat(`${tool.category}.label`)} · {tt(`${tool.slug}.desc`)}
                    </span>
                  </span>
                  {soon ? (
                    <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
                      {tc('soon')}
                    </span>
                  ) : (
                    activeRow && <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  )}
                </button>
              )
            })
          )}
        </div>

        <div className="flex items-center gap-4 border-t border-border/50 px-4 py-2 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1"><ArrowUp className="h-3 w-3" /><ArrowDown className="h-3 w-3" /> {tc('navigate')}</span>
          <span className="flex items-center gap-1"><CornerDownLeft className="h-3 w-3" /> {tc('open')}</span>
        </div>
      </div>
    </div>
  )
}
