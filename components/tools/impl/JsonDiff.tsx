'use client'

import { useMemo, useState } from 'react'
import { AlertCircle, Plus, Minus, Pencil } from 'lucide-react'
import { ToolTextarea } from '../ui'
import { tryParse, diffJson, type Json, type DiffEntry } from '@/lib/tools/json-convert'

function preview(v: Json | undefined): string {
  const s = JSON.stringify(v)
  return s && s.length > 80 ? s.slice(0, 80) + '…' : s ?? ''
}

const META = {
  added: { Icon: Plus, cls: 'text-ufo-green', bg: 'bg-ufo-green/5' },
  removed: { Icon: Minus, cls: 'text-destructive', bg: 'bg-destructive/5' },
  changed: { Icon: Pencil, cls: 'text-amber-500', bg: 'bg-amber-500/5' },
} as const

function Entry({ entry }: { entry: DiffEntry }) {
  const { Icon, cls, bg } = META[entry.type]
  return (
    <div className={`flex items-start gap-2 rounded-lg px-3 py-2 text-sm ${bg}`}>
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${cls}`} />
      <div className="min-w-0 flex-1">
        <code className="font-mono text-xs font-semibold">{entry.path}</code>
        <div className="mt-0.5 space-y-0.5 font-mono text-xs text-muted-foreground">
          {entry.before !== undefined && <div className="break-all text-destructive/80">- {preview(entry.before)}</div>}
          {entry.after !== undefined && <div className="break-all text-ufo-green/80">+ {preview(entry.after)}</div>}
        </div>
      </div>
    </div>
  )
}

export function JsonDiff() {
  const [a, setA] = useState('')
  const [b, setB] = useState('')

  const result = useMemo(() => {
    if (!a.trim() || !b.trim()) return null
    const pa = tryParse(a)
    if (pa.error) return { ok: false as const, error: `Left: ${pa.error}` }
    const pb = tryParse(b)
    if (pb.error) return { ok: false as const, error: `Right: ${pb.error}` }
    return { ok: true as const, diff: diffJson(pa.value, pb.value) }
  }, [a, b])

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground">Left (A)</label>
          <ToolTextarea value={a} onChange={(e) => setA(e.target.value)} placeholder="Original JSON…" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground">Right (B)</label>
          <ToolTextarea value={b} onChange={(e) => setB(e.target.value)} placeholder="Changed JSON…" />
        </div>
      </div>

      {result && !result.ok && (
        <p className="flex items-center gap-1.5 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" /> {result.error}
        </p>
      )}

      {result && result.ok && (
        result.diff.length === 0 ? (
          <p className="rounded-xl border border-ufo-green/30 bg-ufo-green/10 px-4 py-3 text-sm font-medium text-ufo-green">
            The two documents are identical.
          </p>
        ) : (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground">{result.diff.length} difference{result.diff.length === 1 ? '' : 's'}</p>
            {result.diff.map((e, i) => (
              <Entry key={i} entry={e} />
            ))}
          </div>
        )
      )}
    </div>
  )
}
