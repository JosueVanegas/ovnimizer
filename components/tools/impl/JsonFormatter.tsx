'use client'

import { useMemo, useState } from 'react'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { CopyButton, Toolbar, ToolTextarea } from '../ui'

const SAMPLE = '{"name":"Ovnimizer","tools":42,"private":true}'

export function JsonFormatter() {
  const t = useTranslations('tools.json-formatter')
  const tc = useTranslations('tools.common')
  const [input, setInput] = useState('')
  const [indent, setIndent] = useState<'2' | '4' | 'tab'>('2')

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: null as string | null }
    try {
      const parsed = JSON.parse(input)
      const space = indent === 'tab' ? '\t' : Number(indent)
      return { output: JSON.stringify(parsed, null, space), error: null }
    } catch (e) {
      return { output: '', error: (e as Error).message }
    }
  }, [input, indent])

  function minify() {
    try {
      setInput(JSON.stringify(JSON.parse(input)))
    } catch {
      /* keep invalid input as-is; error already shown */
    }
  }

  return (
    <div className="space-y-4">
      <Toolbar>
        <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/40 p-0.5 text-xs">
          {(['2', '4', 'tab'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setIndent(v)}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                indent === v ? 'bg-ufo-green text-black' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {v === 'tab' ? t('tab') : t('spaces', { n: v })}
            </button>
          ))}
        </div>
        <button
          onClick={minify}
          className="rounded-lg border border-border/60 bg-muted/40 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-muted/70"
        >
          {tc('minify')}
        </button>
        <button
          onClick={() => setInput(SAMPLE)}
          className="rounded-lg border border-border/60 bg-muted/40 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-muted/70"
        >
          {tc('sample')}
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
          <label className="text-xs font-semibold text-muted-foreground">{tc('input')}</label>
          <ToolTextarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('inputPlaceholder')}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-muted-foreground">{tc('output')}</label>
            <CopyButton value={output} />
          </div>
          <ToolTextarea value={output} readOnly placeholder={t('outputPlaceholder')} />
        </div>
      </div>

      {input.trim() &&
        (error ? (
          <p className="flex items-center gap-1.5 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </p>
        ) : (
          <p className="flex items-center gap-1.5 text-sm text-ufo-green">
            <CheckCircle2 className="h-4 w-4 shrink-0" /> {t('valid')}
          </p>
        ))}
    </div>
  )
}
