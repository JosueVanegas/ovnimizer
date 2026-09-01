'use client'

import { useMemo, useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { CopyButton, ToolTextarea } from '../ui'
import { tryParse, jsonToYaml, jsonToCsv, jsonToTypeScript, type Json } from '@/lib/tools/json-convert'

function JsonConvert({
  transform,
  outLabel,
  outPlaceholder,
}: {
  transform: (v: Json) => string
  outLabel: string
  outPlaceholder: string
}) {
  const [input, setInput] = useState('')

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: null as string | null }
    const parsed = tryParse(input)
    if (parsed.error) return { output: '', error: parsed.error }
    try {
      return { output: transform(parsed.value), error: null }
    } catch (e) {
      return { output: '', error: (e as Error).message }
    }
  }, [input, transform])

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground">JSON</label>
          <ToolTextarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste JSON here…" className="min-h-72" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-muted-foreground">
              {outLabel}
              {output && <span className="ml-2 font-normal">· {output.length} chars</span>}
            </label>
            <CopyButton value={output} />
          </div>
          <ToolTextarea value={output} readOnly placeholder={outPlaceholder} className="min-h-72" />
        </div>
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </p>
      )}
    </div>
  )
}

const minify = (v: Json) => JSON.stringify(v)
const toTs = (v: Json) => jsonToTypeScript(v)

export function JsonMinifier() {
  return <JsonConvert transform={minify} outLabel="Minified" outPlaceholder="Minified JSON…" />
}
export function JsonToYaml() {
  return <JsonConvert transform={jsonToYaml} outLabel="YAML" outPlaceholder="YAML output…" />
}
export function JsonToCsv() {
  return <JsonConvert transform={jsonToCsv} outLabel="CSV" outPlaceholder="CSV output (expects a JSON array)…" />
}
export function JsonToTypeScript() {
  return <JsonConvert transform={toTs} outLabel="TypeScript" outPlaceholder="Generated interfaces…" />
}
