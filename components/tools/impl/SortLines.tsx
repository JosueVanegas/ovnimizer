'use client'

import { useMemo, useState } from 'react'
import { CopyButton, Toolbar, ToolTextarea } from '../ui'

type Order = 'asc' | 'desc'
type Kind = 'alpha' | 'numeric' | 'length'

export function SortLines() {
  const [input, setInput] = useState('')
  const [order, setOrder] = useState<Order>('asc')
  const [kind, setKind] = useState<Kind>('alpha')
  const [caseInsensitive, setCaseInsensitive] = useState(true)
  const [removeEmpty, setRemoveEmpty] = useState(true)

  const output = useMemo(() => {
    let lines = input.split('\n')
    if (removeEmpty) lines = lines.filter((l) => l.trim() !== '')
    const cmp = (a: string, b: string) => {
      if (kind === 'numeric') return parseFloat(a) - parseFloat(b) || 0
      if (kind === 'length') return a.length - b.length
      const x = caseInsensitive ? a.toLowerCase() : a
      const y = caseInsensitive ? b.toLowerCase() : b
      return x.localeCompare(y)
    }
    lines.sort(cmp)
    if (order === 'desc') lines.reverse()
    return lines.join('\n')
  }, [input, order, kind, caseInsensitive, removeEmpty])

  return (
    <div className="space-y-4">
      <Toolbar>
        <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/40 p-0.5 text-xs">
          {(['asc', 'desc'] as const).map((o) => (
            <button
              key={o}
              onClick={() => setOrder(o)}
              className={`rounded-md px-3 py-1 font-semibold transition-colors ${
                order === o ? 'bg-ufo-green text-black' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {o === 'asc' ? 'A → Z' : 'Z → A'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/40 p-0.5 text-xs">
          {(['alpha', 'numeric', 'length'] as const).map((k) => (
            <button
              key={k}
              onClick={() => setKind(k)}
              className={`rounded-md px-3 py-1 font-semibold capitalize transition-colors ${
                kind === k ? 'bg-ufo-green text-black' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {k}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <input type="checkbox" checked={caseInsensitive} onChange={(e) => setCaseInsensitive(e.target.checked)} className="accent-[var(--ufo-green)]" />
          case-insensitive
        </label>
        <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <input type="checkbox" checked={removeEmpty} onChange={(e) => setRemoveEmpty(e.target.checked)} className="accent-[var(--ufo-green)]" />
          remove empty
        </label>
      </Toolbar>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground">Input</label>
          <ToolTextarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="One item per line…" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-muted-foreground">Sorted</label>
            <CopyButton value={output} />
          </div>
          <ToolTextarea value={output} readOnly placeholder="Result…" />
        </div>
      </div>
    </div>
  )
}
