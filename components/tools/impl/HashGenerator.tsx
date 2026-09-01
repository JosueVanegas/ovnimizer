'use client'

import { useEffect, useState } from 'react'
import { CopyButton, ToolTextarea } from '../ui'

const ALGOS = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as const
type Algo = (typeof ALGOS)[number]

async function hash(algo: Algo, text: string): Promise<string> {
  const data = new TextEncoder().encode(text)
  const buf = await crypto.subtle.digest(algo, data)
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export function HashGenerator() {
  const [input, setInput] = useState('')
  const [hashes, setHashes] = useState<Record<Algo, string>>({
    'SHA-1': '',
    'SHA-256': '',
    'SHA-384': '',
    'SHA-512': '',
  })

  useEffect(() => {
    let cancelled = false
    if (!input) {
      setHashes({ 'SHA-1': '', 'SHA-256': '', 'SHA-384': '', 'SHA-512': '' })
      return
    }
    Promise.all(ALGOS.map((a) => hash(a, input))).then((results) => {
      if (cancelled) return
      setHashes(Object.fromEntries(ALGOS.map((a, i) => [a, results[i]])) as Record<Algo, string>)
    })
    return () => {
      cancelled = true
    }
  }, [input])

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground">Input</label>
        <ToolTextarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste text to hash…"
          className="min-h-28"
        />
      </div>

      <div className="space-y-3">
        {ALGOS.map((algo) => (
          <div key={algo} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground">{algo}</label>
              <CopyButton value={hashes[algo]} />
            </div>
            <code className="block break-all rounded-lg border border-border/50 bg-muted/20 p-2.5 font-mono text-xs text-muted-foreground min-h-9">
              {hashes[algo] || '—'}
            </code>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Computed locally via the Web Crypto API. MD5 isn&apos;t supported by browsers and is omitted.
      </p>
    </div>
  )
}
