'use client'

import { Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { OPEN_COMMAND_EVENT } from './CommandPalette'

export function SearchTrigger({ className }: { className?: string }) {
  const tc = useTranslations('common')
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_COMMAND_EVENT))}
      aria-label={tc('searchTools')}
      className={
        className ??
        'flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted/70'
      }
    >
      <Search className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">{tc('searchTools')}</span>
      <kbd className="hidden sm:inline rounded border border-border/60 px-1 text-[10px]">⌘K</kbd>
    </button>
  )
}
