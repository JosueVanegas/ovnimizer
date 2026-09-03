'use client'

import { useMemo, useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { CopyButton, Toolbar, ToolTextarea } from '../ui'

function encodeB64(text: string): string {
  return btoa(String.fromCharCode(...new TextEncoder().encode(text)))
}
function decodeB64(b64: string): string {
  const bytes = Uint8Array.from(atob(b64.trim()), (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export function Base64Tool() {
  const t = useTranslations('tools.base64')
  const tc = useTranslations('tools.common')
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')

  const { output, error } = useMemo(() => {
    if (!input) return { output: '', error: null as string | null }
    try {
      return { output: mode === 'encode' ? encodeB64(input) : decodeB64(input), error: null }
    } catch {
      return { output: '', error: t('invalid') }
    }
  }, [input, mode, t])

  return (
    <div className="space-y-4">
      <Toolbar>
        <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/40 p-0.5 text-xs">
          {(['encode', 'decode'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setMode(v)}
              className={`rounded-md px-3 py-1 font-semibold transition-colors ${
                mode === v ? 'bg-ufo-green text-black' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {v === 'encode' ? tc('encode') : tc('decode')}
            </button>
          ))}
        </div>
        <button
          onClick={() => setInput(output)}
          disabled={!output}
          className="rounded-lg border border-border/60 bg-muted/40 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-muted/70 disabled:opacity-40"
        >
          {tc('useOutputAsInput')}
        </button>
        <button
          onClick={() => setInput('')}
          className="rounded-lg border border-border/60 bg-muted/40 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-muted/70"
        >
          {tc('clear')}
        </button>
      </Toolbar>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground">
            {mode === 'encode' ? t('plainText') : t('base64')}
          </label>
          <ToolTextarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? t('encodePlaceholder') : t('decodePlaceholder')}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-muted-foreground">
              {mode === 'encode' ? t('base64') : t('plainText')}
            </label>
            <CopyButton value={output} />
          </div>
          <ToolTextarea value={output} readOnly placeholder={tc('result')} />
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
