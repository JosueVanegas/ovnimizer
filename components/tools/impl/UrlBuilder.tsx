'use client'

import { useMemo, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { CopyButton, ToolInput } from '../ui'

interface Param {
  id: number
  key: string
  value: string
}
let nextId = 2

export function UrlBuilder() {
  const [base, setBase] = useState('https://example.com/path')
  const [params, setParams] = useState<Param[]>([{ id: 1, key: '', value: '' }])

  const url = useMemo(() => {
    const pairs = params.filter((p) => p.key)
    try {
      const u = new URL(base)
      // Drop any pre-existing query in the base so the builder is the source of truth.
      u.search = ''
      for (const p of pairs) u.searchParams.append(p.key, p.value)
      return u.toString()
    } catch {
      const qs = pairs
        .map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
        .join('&')
      const b = base.split('?')[0]
      return qs ? `${b}?${qs}` : b
    }
  }, [base, params])

  const update = (id: number, patch: Partial<Param>) =>
    setParams((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground">Base URL</label>
        <ToolInput value={base} onChange={(e) => setBase(e.target.value)} placeholder="https://example.com/path" />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground">Query parameters</label>
        {params.map((p) => (
          <div key={p.id} className="flex items-center gap-2">
            <ToolInput value={p.key} onChange={(e) => update(p.id, { key: e.target.value })} placeholder="key" />
            <ToolInput value={p.value} onChange={(e) => update(p.id, { value: e.target.value })} placeholder="value" />
            <button
              onClick={() => setParams((prev) => (prev.length > 1 ? prev.filter((x) => x.id !== p.id) : prev))}
              disabled={params.length <= 1}
              className="shrink-0 text-muted-foreground transition-colors hover:text-destructive disabled:opacity-30"
              aria-label="Remove parameter"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          onClick={() => setParams((prev) => [...prev, { id: nextId++, key: '', value: '' }])}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/40 px-3 py-1.5 text-xs font-semibold hover:bg-muted/70"
        >
          <Plus className="h-3.5 w-3.5" /> Add parameter
        </button>
      </div>

      <div className="flex items-center justify-between gap-2 rounded-xl border border-border/50 bg-muted/20 p-3">
        <code className="break-all font-mono text-sm">{url}</code>
        <CopyButton value={url} className="shrink-0" />
      </div>
    </div>
  )
}
