'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { ChevronDown, Search, Check } from 'lucide-react'
import { FormatChoice, ToolMode } from '@/types'
import { OUTPUT_FORMATS, OUTPUT_FORMAT_ORDER, FormatCategory } from '@/lib/formats'

const CATS = ['all', 'web', 'lossless', 'raster', 'icon'] as const
type Cat = (typeof CATS)[number]

interface FormatPickerProps {
  value: FormatChoice
  mode: ToolMode
  onChange: (fmt: FormatChoice) => void
  disabled?: boolean
}

export function FormatPicker({ value, mode, onChange, disabled }: FormatPickerProps) {
  const t = useTranslations('format')
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState<Cat>('all')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onOut(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onOut)
    return () => document.removeEventListener('mousedown', onOut)
  }, [])

  // 'keep' is only available in Optimize mode, always shown first when present.
  const choices: FormatChoice[] = [
    ...(mode === 'optimize' ? (['keep'] as FormatChoice[]) : []),
    ...OUTPUT_FORMAT_ORDER,
  ]

  const catOf = (f: FormatChoice): FormatCategory | 'keep' =>
    f === 'keep' ? 'keep' : OUTPUT_FORMATS[f].cat

  const filtered = choices.filter((f) => {
    if (cat !== 'all' && f !== 'keep' && catOf(f) !== cat) return false
    if (search) {
      const q = search.toLowerCase()
      const label = (f === 'keep' ? t('keepLabel') : f).toLowerCase()
      const desc = t(`desc.${f}` as Parameters<typeof t>[0]).toLowerCase()
      if (!label.includes(q) && !desc.includes(q)) return false
    }
    return true
  })

  const label = (f: FormatChoice) => (f === 'keep' ? t('keepLabel') : f.toUpperCase())

  return (
    <div ref={ref} className="space-y-1.5">
      <label className="text-sm font-semibold">
        {mode === 'optimize' ? t('label') : t('convertLabel')}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setOpen((v) => !v)}
          disabled={disabled}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-border/60 bg-muted/40 hover:bg-muted/70 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider">
              {label(value)}
            </span>
            <span className="text-muted-foreground text-xs">
              {t(`desc.${value}` as Parameters<typeof t>[0])}
            </span>
          </span>
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {open && (
          <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-popover border border-border/60 rounded-xl shadow-xl overflow-hidden animate-slide-up">
            <div className="p-2 border-b border-border/40">
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-muted/50">
                <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <input
                  autoFocus
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                />
              </div>
            </div>

            <div className="flex gap-0.5 p-1.5 border-b border-border/40">
              {CATS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCat(c)}
                  className={[
                    'flex-1 px-2 py-1 rounded-lg text-xs font-semibold transition-colors',
                    cat === c
                      ? 'bg-emerald-500 text-white'
                      : 'text-muted-foreground hover:bg-muted/60',
                  ].join(' ')}
                >
                  {t(`cat.${c}` as Parameters<typeof t>[0])}
                </button>
              ))}
            </div>

            <div className="p-2 space-y-0.5 max-h-52 overflow-y-auto">
              {filtered.map((fmt) => {
                const active = fmt === value
                return (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => {
                      onChange(fmt)
                      setOpen(false)
                      setSearch('')
                    }}
                    className={[
                      'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                      active
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'hover:bg-muted/60',
                    ].join(' ')}
                  >
                    <span
                      className={`w-14 text-xs font-bold uppercase tracking-wider shrink-0 ${
                        active ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'
                      }`}
                    >
                      {label(fmt)}
                    </span>
                    <span className="text-xs text-muted-foreground flex-1 truncate">
                      {t(`desc.${fmt}` as Parameters<typeof t>[0])}
                    </span>
                    {active && <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                  </button>
                )
              })}
              {filtered.length === 0 && (
                <p className="text-center text-xs text-muted-foreground py-3">
                  {t('noResults')}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
