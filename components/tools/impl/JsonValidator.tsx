'use client'

import { useMemo, useState } from 'react'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { ToolTextarea } from '../ui'
import { tryParse } from '@/lib/tools/json-convert'

function locate(input: string, message: string): string {
  const m = message.match(/position (\d+)/)
  if (!m) return message
  const pos = Number(m[1])
  const before = input.slice(0, pos)
  const line = before.split('\n').length
  const col = pos - before.lastIndexOf('\n')
  return `${message} (line ${line}, column ${col})`
}

export function JsonValidator() {
  const [input, setInput] = useState('')

  const status = useMemo(() => {
    if (!input.trim()) return null
    const parsed = tryParse(input)
    if (parsed.error) return { ok: false as const, message: locate(input, parsed.error) }
    const type = Array.isArray(parsed.value)
      ? `array (${parsed.value.length} items)`
      : parsed.value === null
        ? 'null'
        : typeof parsed.value === 'object'
          ? `object (${Object.keys(parsed.value as object).length} keys)`
          : typeof parsed.value
    return { ok: true as const, type }
  }, [input])

  return (
    <div className="space-y-4">
      <ToolTextarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste JSON to validate…"
        className="min-h-72"
      />
      {status &&
        (status.ok ? (
          <div className="flex items-center gap-2 rounded-xl border border-ufo-green/30 bg-ufo-green/10 px-4 py-3 text-sm font-medium text-ufo-green">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            Valid JSON · root is {status.type}
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" />
            {status.message}
          </div>
        ))}
    </div>
  )
}
