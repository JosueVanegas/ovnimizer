'use client'

import { useEffect, useMemo, useState } from 'react'
import { CopyButton, ToolInput } from '../ui'

function parseInput(raw: string): Date | null {
  const t = raw.trim()
  if (!t) return null
  if (/^\d+$/.test(t)) {
    const num = Number(t)
    // Heuristic: 13+ digits → milliseconds, else seconds.
    return new Date(t.length >= 13 ? num : num * 1000)
  }
  const d = new Date(t)
  return isNaN(d.getTime()) ? null : d
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/40 py-2 last:border-0">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <code className="font-mono text-sm">{value}</code>
        <CopyButton value={value} label="" />
      </div>
    </div>
  )
}

export function UnixTimestamp() {
  const [input, setInput] = useState('')
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const date = useMemo(() => parseInput(input), [input])

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/50 bg-muted/20 p-3">
        <span className="text-xs font-semibold text-muted-foreground">Current Unix time</span>
        <code className="font-mono text-base">{Math.floor(now / 1000)}</code>
        <CopyButton value={String(Math.floor(now / 1000))} label="" />
        <button
          onClick={() => setInput(String(Math.floor(now / 1000)))}
          className="rounded-lg border border-border/60 bg-muted/40 px-2.5 py-1 text-xs font-semibold hover:bg-muted/70"
        >
          Use
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground">
          Timestamp (s or ms) or a date string
        </label>
        <ToolInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 1516239022 or 2026-07-15T10:00:00Z"
        />
      </div>

      {input.trim() && !date && <p className="text-sm text-destructive">Unrecognized date or timestamp.</p>}

      {date && (
        <div className="rounded-xl border border-border/50 bg-muted/10 px-4">
          <Row label="Unix (seconds)" value={String(Math.floor(date.getTime() / 1000))} />
          <Row label="Unix (ms)" value={String(date.getTime())} />
          <Row label="ISO 8601" value={date.toISOString()} />
          <Row label="UTC" value={date.toUTCString()} />
          <Row label="Local" value={date.toString()} />
        </div>
      )}
    </div>
  )
}
