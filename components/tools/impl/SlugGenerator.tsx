'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { CopyButton, Toolbar, ToolTextarea } from '../ui'

function slugify(text: string, sep: string, lower: boolean, stripAccents: boolean): string {
  let s = text.trim()
  if (stripAccents) s = s.normalize('NFD').replace(/\p{Diacritic}/gu, '')
  if (lower) s = s.toLowerCase()
  return s
    .replace(/[^a-zA-Z0-9]+/g, sep)
    .replace(new RegExp(`\\${sep}{2,}`, 'g'), sep)
    .replace(new RegExp(`^\\${sep}|\\${sep}$`, 'g'), '')
}

export function SlugGenerator() {
  const t = useTranslations('tools.slug-generator')
  const [input, setInput] = useState('')
  const [sep, setSep] = useState<'-' | '_'>('-')
  const [lower, setLower] = useState(true)
  const [stripAccents, setStripAccents] = useState(true)

  const output = useMemo(
    () =>
      input
        .split('\n')
        .map((line) => (line.trim() ? slugify(line, sep, lower, stripAccents) : ''))
        .join('\n'),
    [input, sep, lower, stripAccents],
  )

  return (
    <div className="space-y-4">
      <Toolbar>
        <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/40 p-0.5 text-xs">
          {(['-', '_'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSep(s)}
              className={`rounded-md px-3 py-1 font-mono font-semibold transition-colors ${
                sep === s ? 'bg-ufo-green text-black' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {s === '-' ? t('hyphen') : t('underscore')}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <input type="checkbox" checked={lower} onChange={(e) => setLower(e.target.checked)} className="accent-[var(--ufo-green)]" />
          {t('lowercase')}
        </label>
        <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <input type="checkbox" checked={stripAccents} onChange={(e) => setStripAccents(e.target.checked)} className="accent-[var(--ufo-green)]" />
          {t('stripAccents')}
        </label>
      </Toolbar>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground">{t('textLabel')}</label>
          <ToolTextarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('textPlaceholder')} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-muted-foreground">{t('slug')}</label>
            <CopyButton value={output} />
          </div>
          <ToolTextarea value={output} readOnly placeholder={t('slugPlaceholder')} />
        </div>
      </div>
    </div>
  )
}
