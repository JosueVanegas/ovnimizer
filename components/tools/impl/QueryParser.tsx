'use client'

import { useMemo, useState } from 'react'
import { CopyButton, ToolInput } from '../ui'

export function QueryParser() {
  const [input, setInput] = useState('')

  const { rows, json } = useMemo(() => {
    if (!input.trim()) return { rows: [] as [string, string][], json: '' }
    let queryString = input.trim()
    const qIndex = queryString.indexOf('?')
    if (qIndex >= 0) queryString = queryString.slice(qIndex + 1)
    const hashIndex = queryString.indexOf('#')
    if (hashIndex >= 0) queryString = queryString.slice(0, hashIndex)

    const params = new URLSearchParams(queryString)
    const rows = Array.from(params.entries())

    const obj: Record<string, string | string[]> = {}
    for (const [k, v] of rows) {
      if (k in obj) {
        const cur = obj[k]
        obj[k] = Array.isArray(cur) ? [...cur, v] : [cur as string, v]
      } else obj[k] = v
    }
    return { rows, json: rows.length ? JSON.stringify(obj, null, 2) : '' }
  }, [input])

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground">URL or query string</label>
        <ToolInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="https://example.com/search?q=hello&tag=a&tag=b"
        />
      </div>

      {rows.length > 0 && (
        <>
          <div className="overflow-hidden rounded-xl border border-border/50">
            <div className="grid grid-cols-[1fr_1.5fr] bg-muted/40 text-xs font-semibold text-muted-foreground">
              <span className="px-3 py-2">Key</span>
              <span className="border-l border-border/50 px-3 py-2">Value</span>
            </div>
            {rows.map(([k, v], i) => (
              <div key={i} className="grid grid-cols-[1fr_1.5fr] border-t border-border/40 text-sm">
                <code className="truncate px-3 py-2 font-mono">{k}</code>
                <code className="truncate border-l border-border/40 px-3 py-2 font-mono text-muted-foreground">{v}</code>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground">As JSON</label>
              <CopyButton value={json} />
            </div>
            <pre className="overflow-x-auto rounded-xl border border-border/50 bg-muted/20 p-3 font-mono text-xs">{json}</pre>
          </div>
        </>
      )}
    </div>
  )
}
