'use client'

import { useMemo, useState } from 'react'
import { CopyButton, Toolbar, ToolTextarea } from '../ui'

export function RemoveDuplicateLines() {
  const [input, setInput] = useState('')
  const [caseInsensitive, setCaseInsensitive] = useState(false)
  const [trim, setTrim] = useState(true)

  const { output, removed } = useMemo(() => {
    const lines = input.split('\n')
    const seen = new Set<string>()
    const result: string[] = []
    for (const line of lines) {
      const candidate = trim ? line.trim() : line
      const key = caseInsensitive ? candidate.toLowerCase() : candidate
      if (seen.has(key)) continue
      seen.add(key)
      result.push(trim ? candidate : line)
    }
    return { output: result.join('\n'), removed: lines.length - result.length }
  }, [input, caseInsensitive, trim])

  return (
    <div className="space-y-4">
      <Toolbar>
        <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <input type="checkbox" checked={caseInsensitive} onChange={(e) => setCaseInsensitive(e.target.checked)} className="accent-[var(--ufo-green)]" />
          case-insensitive
        </label>
        <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <input type="checkbox" checked={trim} onChange={(e) => setTrim(e.target.checked)} className="accent-[var(--ufo-green)]" />
          trim whitespace
        </label>
        {input.trim() && (
          <span className="text-xs text-muted-foreground">
            {removed > 0 ? `${removed} duplicate${removed === 1 ? '' : 's'} removed` : 'No duplicates'}
          </span>
        )}
      </Toolbar>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground">Input</label>
          <ToolTextarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="One item per line…" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-muted-foreground">Unique lines</label>
            <CopyButton value={output} />
          </div>
          <ToolTextarea value={output} readOnly placeholder="Result…" />
        </div>
      </div>
    </div>
  )
}
