'use client'

import { useMemo, useState } from 'react'
import { CopyButton, ToolTextarea } from '../ui'

function words(s: string): string[] {
  return (
    s
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/[_\-.]+/g, ' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean) || []
  )
}

const CASES: { key: string; label: string; fn: (s: string) => string }[] = [
  { key: 'camel', label: 'camelCase', fn: (s) => words(s).map((w, i) => (i === 0 ? w.toLowerCase() : cap(w))).join('') },
  { key: 'pascal', label: 'PascalCase', fn: (s) => words(s).map(cap).join('') },
  { key: 'snake', label: 'snake_case', fn: (s) => words(s).map((w) => w.toLowerCase()).join('_') },
  { key: 'kebab', label: 'kebab-case', fn: (s) => words(s).map((w) => w.toLowerCase()).join('-') },
  { key: 'constant', label: 'CONSTANT_CASE', fn: (s) => words(s).map((w) => w.toUpperCase()).join('_') },
  { key: 'title', label: 'Title Case', fn: (s) => words(s).map(cap).join(' ') },
  { key: 'sentence', label: 'Sentence case', fn: (s) => { const w = words(s).map((x) => x.toLowerCase()); return w.length ? cap(w[0]) + (w.length > 1 ? ' ' + w.slice(1).join(' ') : '') : '' } },
  { key: 'upper', label: 'UPPERCASE', fn: (s) => s.toUpperCase() },
  { key: 'lower', label: 'lowercase', fn: (s) => s.toLowerCase() },
]

function cap(w: string): string {
  return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
}

export function CaseConverter() {
  const [input, setInput] = useState('')
  const results = useMemo(() => CASES.map((c) => ({ ...c, value: input ? c.fn(input) : '' })), [input])

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground">Input</label>
        <ToolTextarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type some text…"
          className="min-h-24"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((r) => (
          <div key={r.key} className="space-y-1.5 rounded-xl border border-border/50 bg-muted/20 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">{r.label}</span>
              <CopyButton value={r.value} label="" />
            </div>
            <code className="block break-all font-mono text-sm">{r.value || '—'}</code>
          </div>
        ))}
      </div>
    </div>
  )
}
