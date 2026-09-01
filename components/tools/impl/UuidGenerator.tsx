'use client'

import { useEffect, useState, useCallback } from 'react'
import { RefreshCw } from 'lucide-react'
import { CopyButton, ToolInput, Toolbar } from '../ui'

export function UuidGenerator() {
  const [count, setCount] = useState(5)
  const [uuids, setUuids] = useState<string[]>([])

  const generate = useCallback(() => {
    const n = Math.min(Math.max(count, 1), 100)
    setUuids(Array.from({ length: n }, () => crypto.randomUUID()))
  }, [count])

  useEffect(() => {
    generate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-4">
      <Toolbar>
        <label className="text-xs font-semibold text-muted-foreground">How many</label>
        <ToolInput
          type="number"
          min={1}
          max={100}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="w-24"
        />
        <button
          onClick={generate}
          className="inline-flex items-center gap-1.5 rounded-lg bg-ufo-green px-3 py-2 text-xs font-bold text-black transition-colors hover:bg-ufo-green/85"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Generate
        </button>
        <CopyButton value={uuids.join('\n')} label="Copy all" />
      </Toolbar>

      <div className="divide-y divide-border/50 overflow-hidden rounded-xl border border-border/50">
        {uuids.map((id, i) => (
          <div key={i} className="flex items-center justify-between gap-3 bg-muted/20 px-3 py-2">
            <code className="truncate font-mono text-sm">{id}</code>
            <CopyButton value={id} label="" className="shrink-0" />
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        RFC 4122 version 4 UUIDs, generated locally with the Web Crypto API.
      </p>
    </div>
  )
}
