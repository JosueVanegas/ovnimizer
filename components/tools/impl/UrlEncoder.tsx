'use client'

import { useMemo, useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { CopyButton, Toolbar, ToolTextarea } from '../ui'

export function UrlEncoder() {
  const t = useTranslations('tools.url-encoder')
  const tc = useTranslations('tools.common')
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [scope, setScope] = useState<'component' | 'full'>('component')

  const { output, error } = useMemo(() => {
    if (!input) return { output: '', error: null as string | null }
    try {
      let out: string
      if (mode === 'encode') {
        out = scope === 'component' ? encodeURIComponent(input) : encodeURI(input)
      } else {
        out = scope === 'component' ? decodeURIComponent(input) : decodeURI(input)
      }
      return { output: out, error: null }
    } catch {
      return { output: '', error: t('malformed') }
    }
  }, [input, mode, scope, t])

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
        <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/40 p-0.5 text-xs">
          {(['component', 'full'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setScope(v)}
              className={`rounded-md px-3 py-1 font-semibold transition-colors ${
                scope === v ? 'bg-ufo-green text-black' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {v === 'component' ? t('component') : t('wholeUrl')}
            </button>
          ))}
        </div>
      </Toolbar>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground">{tc('input')}</label>
          <ToolTextarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('placeholder')} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-muted-foreground">{tc('output')}</label>
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
