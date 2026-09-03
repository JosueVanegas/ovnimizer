'use client'

import { useCallback, useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { CopyButton } from '../ui'
import { Slider } from '@/components/ui/slider'

const SETS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.<>?',
}
type SetKey = keyof typeof SETS

function randomPassword(length: number, enabled: SetKey[]): string {
  const pool = enabled.map((k) => SETS[k]).join('')
  if (!pool) return ''
  const bytes = crypto.getRandomValues(new Uint32Array(length))
  let out = ''
  for (let i = 0; i < length; i++) out += pool[bytes[i] % pool.length]
  return out
}

function strengthLevel(length: number, poolCount: number): { key: 'weak' | 'fair' | 'strong'; pct: number; color: string } {
  const poolSize = poolCount * 26
  const bits = length * Math.log2(Math.max(poolSize, 1))
  if (bits < 40) return { key: 'weak', pct: 33, color: 'bg-destructive' }
  if (bits < 70) return { key: 'fair', pct: 66, color: 'bg-amber-500' }
  return { key: 'strong', pct: 100, color: 'bg-ufo-green' }
}

export function PasswordGenerator() {
  const t = useTranslations('tools.password-generator')
  const tc = useTranslations('tools.common')
  const [length, setLength] = useState(20)
  const [enabled, setEnabled] = useState<SetKey[]>(['lower', 'upper', 'numbers', 'symbols'])
  const [password, setPassword] = useState('')

  const generate = useCallback(() => {
    setPassword(randomPassword(length, enabled))
  }, [length, enabled])

  useEffect(() => {
    generate()
  }, [generate])

  const toggle = (k: SetKey) =>
    setEnabled((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]))

  const s = strengthLevel(length, enabled.length)

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/20 p-3">
        <code className="flex-1 break-all font-mono text-base">{password || '—'}</code>
        <button
          onClick={generate}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border/60 bg-muted/40 px-3 py-1.5 text-xs font-semibold hover:bg-muted/70"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
        <CopyButton value={password} className="shrink-0" />
      </div>

      <div className="space-y-1.5">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className={`h-full rounded-full transition-all ${s.color}`} style={{ width: `${s.pct}%` }} />
        </div>
        <p className="text-xs text-muted-foreground">{t('strength', { label: t(s.key) })}</p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold">{tc('length')}</label>
          <span className="font-mono text-sm text-muted-foreground">{length}</span>
        </div>
        <Slider value={[length]} min={6} max={64} step={1} onValueChange={(v) => setLength(Array.isArray(v) ? v[0] : v)} />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {(Object.keys(SETS) as SetKey[]).map((k) => (
          <button
            key={k}
            onClick={() => toggle(k)}
            className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
              enabled.includes(k)
                ? 'border-ufo-green bg-ufo-green/10 text-ufo-green'
                : 'border-border/60 bg-muted/30 text-muted-foreground hover:bg-muted/60'
            }`}
          >
            {t(k)}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{t('note')}</p>
    </div>
  )
}
