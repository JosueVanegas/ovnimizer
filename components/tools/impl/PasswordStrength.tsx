'use client'

import { useMemo, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ToolInput } from '../ui'

function poolSize(pw: string): number {
  let pool = 0
  if (/[a-z]/.test(pw)) pool += 26
  if (/[A-Z]/.test(pw)) pool += 26
  if (/[0-9]/.test(pw)) pool += 10
  if (/[^a-zA-Z0-9]/.test(pw)) pool += 33
  return pool
}

export function PasswordStrength() {
  const t = useTranslations('tools.password-strength')

  function humanizeTime(seconds: number): string {
    if (seconds < 1) return t('instantly')
    const units: [number, 'second' | 'minute' | 'hour' | 'day' | 'year' | 'century'][] = [
      [60, 'second'],
      [60, 'minute'],
      [24, 'hour'],
      [365, 'day'],
      [100, 'year'],
      [Infinity, 'century'],
    ]
    let value = seconds
    let name: 'second' | 'minute' | 'hour' | 'day' | 'year' | 'century' = 'second'
    for (const [div, label] of units) {
      if (value < div) {
        name = label
        break
      }
      value /= div
      name = label
    }
    return t(`unit_${name}`, { n: Math.round(value) })
  }

  const [pw, setPw] = useState('')
  const [show, setShow] = useState(false)

  const analysis = useMemo(() => {
    if (!pw) return null
    const pool = poolSize(pw)
    const entropy = pw.length * Math.log2(pool || 1)
    // Offline fast-hash guessing estimate: 1e10 guesses/sec.
    const seconds = Math.pow(2, entropy) / 1e10

    const feedback: string[] = []
    if (pw.length < 12) feedback.push(t('tipLength'))
    if (!/[A-Z]/.test(pw)) feedback.push(t('tipUpper'))
    if (!/[0-9]/.test(pw)) feedback.push(t('tipNumber'))
    if (!/[^a-zA-Z0-9]/.test(pw)) feedback.push(t('tipSymbol'))
    if (/(.)\1{2,}/.test(pw)) feedback.push(t('tipRepeat'))

    let label: string
    let pct: number
    let color: string
    if (entropy < 36) [label, pct, color] = [t('veryWeak'), 20, 'bg-destructive']
    else if (entropy < 60) [label, pct, color] = [t('weak'), 45, 'bg-orange-500']
    else if (entropy < 80) [label, pct, color] = [t('fair'), 65, 'bg-amber-500']
    else if (entropy < 110) [label, pct, color] = [t('strong'), 85, 'bg-ufo-green']
    else [label, pct, color] = [t('veryStrong'), 100, 'bg-ufo-green']

    return { entropy, seconds, feedback, label, pct, color }
  }, [pw, t])

  return (
    <div className="space-y-5">
      <div className="relative">
        <ToolInput
          type={show ? 'text' : 'password'}
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder={t('placeholder')}
          className="pr-10"
        />
        <button
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label={show ? t('hide') : t('show')}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {analysis && (
        <>
          <div className="space-y-1.5">
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className={`h-full rounded-full transition-all ${analysis.color}`} style={{ width: `${analysis.pct}%` }} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">{analysis.label}</span>
              <span className="text-muted-foreground">{t('entropy', { bits: Math.round(analysis.entropy) })}</span>
            </div>
          </div>

          <div className="rounded-xl border border-border/50 bg-muted/20 px-4 py-3 text-sm">
            {t('crackTime', { time: humanizeTime(analysis.seconds) })}
          </div>

          {analysis.feedback.length > 0 && (
            <ul className="space-y-1 text-sm text-muted-foreground">
              {analysis.feedback.map((fb) => (
                <li key={fb} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  {fb}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
      <p className="text-xs text-muted-foreground">{t('note')}</p>
    </div>
  )
}
