'use client'

import { useCallback, useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { CopyButton, ToolInput, Toolbar } from '../ui'
import { Slider } from '@/components/ui/slider'

const CHARSETS = {
  alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  hex: '0123456789abcdef',
} as const
type Charset = keyof typeof CHARSETS
const SYMBOLS = '!@#$%^&*()-_=+[]{}'

function randomString(length: number, pool: string): string {
  if (!pool) return ''
  const bytes = crypto.getRandomValues(new Uint32Array(length))
  let out = ''
  for (let i = 0; i < length; i++) out += pool[bytes[i] % pool.length]
  return out
}

export function RandomString() {
  const t = useTranslations('tools.random-string')
  const tc = useTranslations('tools.common')
  const [length, setLength] = useState(24)
  const [charset, setCharset] = useState<Charset>('alphanumeric')
  const [symbols, setSymbols] = useState(false)
  const [count, setCount] = useState(5)
  const [results, setResults] = useState<string[]>([])

  const generate = useCallback(() => {
    const pool = CHARSETS[charset] + (symbols ? SYMBOLS : '')
    const n = Math.min(Math.max(count, 1), 50)
    setResults(Array.from({ length: n }, () => randomString(length, pool)))
  }, [length, charset, symbols, count])

  useEffect(() => {
    generate()
  }, [generate])

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold">{tc('length')}</label>
          <span className="font-mono text-sm text-muted-foreground">{length}</span>
        </div>
        <Slider value={[length]} min={4} max={128} step={1} onValueChange={(v) => setLength(Array.isArray(v) ? v[0] : v)} />
      </div>

      <Toolbar>
        <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/40 p-0.5 text-xs">
          {(Object.keys(CHARSETS) as Charset[]).map((c) => (
            <button
              key={c}
              onClick={() => setCharset(c)}
              className={`rounded-md px-2.5 py-1 font-semibold transition-colors ${
                charset === c ? 'bg-ufo-green text-black' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {t(c)}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <input type="checkbox" checked={symbols} onChange={(e) => setSymbols(e.target.checked)} className="accent-[var(--ufo-green)]" />
          {t('symbols')}
        </label>
        <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          {tc('count')}
          <ToolInput type="number" min={1} max={50} value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-16" />
        </label>
        <button
          onClick={generate}
          className="inline-flex items-center gap-1.5 rounded-lg bg-ufo-green px-3 py-1.5 text-xs font-bold text-black transition-colors hover:bg-ufo-green/85"
        >
          <RefreshCw className="h-3.5 w-3.5" /> {tc('generate')}
        </button>
        <CopyButton value={results.join('\n')} label={tc('copyAll')} />
      </Toolbar>

      <div className="divide-y divide-border/50 overflow-hidden rounded-xl border border-border/50">
        {results.map((s, i) => (
          <div key={i} className="flex items-center justify-between gap-3 bg-muted/20 px-3 py-2">
            <code className="truncate font-mono text-sm">{s}</code>
            <CopyButton value={s} label="" className="shrink-0" />
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{t('note')}</p>
    </div>
  )
}
