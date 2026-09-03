'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { ToolTextarea } from '../ui'

function analyze(text: string) {
  const chars = text.length
  const charsNoSpaces = text.replace(/\s/g, '').length
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const lines = text ? text.split(/\n/).length : 0
  const sentences = (text.match(/[^.!?]+[.!?]+/g) || []).length
  const paragraphs = text.trim() ? text.trim().split(/\n{2,}/).filter(Boolean).length : 0
  const readingMins = words / 200
  const reading = words === 0 ? '0s' : readingMins < 1 ? `${Math.ceil(readingMins * 60)}s` : `${Math.ceil(readingMins)} min`
  return { chars, charsNoSpaces, words, lines, sentences, paragraphs, reading }
}

const TILES: { key: keyof ReturnType<typeof analyze>; label: string }[] = [
  { key: 'words', label: 'words' },
  { key: 'chars', label: 'characters' },
  { key: 'charsNoSpaces', label: 'charactersNoSpaces' },
  { key: 'sentences', label: 'sentences' },
  { key: 'lines', label: 'lines' },
  { key: 'paragraphs', label: 'paragraphs' },
  { key: 'reading', label: 'readingTime' },
]

export function TextStats() {
  const t = useTranslations('tools.character-counter')
  const [text, setText] = useState('')
  const stats = useMemo(() => analyze(text), [text])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {TILES.map((tile) => (
          <div key={tile.key} className="rounded-xl border border-border/50 bg-muted/20 p-3 text-center">
            <p className="text-2xl font-extrabold tabular-nums">{stats[tile.key]}</p>
            <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">{t(tile.label)}</p>
          </div>
        ))}
      </div>
      <ToolTextarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t('placeholder')}
        className="min-h-56"
      />
    </div>
  )
}
