'use client'

import { useMemo, useState } from 'react'
import { Check, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ToolInput } from '../ui'

function hexToRgb(hex: string): [number, number, number] | null {
  let h = hex.replace('#', '').trim()
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

function luminance([r, g, b]: [number, number, number]): number {
  const a = [r, g, b].map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]
}

function contrast(fg: [number, number, number], bg: [number, number, number]): number {
  const l1 = luminance(fg)
  const l2 = luminance(bg)
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
}

function Judgement({ label, pass }: { label: string; pass: boolean }) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium ${
        pass ? 'bg-ufo-green/10 text-ufo-green' : 'bg-destructive/10 text-destructive'
      }`}
    >
      {label}
      {pass ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
    </div>
  )
}

export function ContrastChecker() {
  const t = useTranslations('tools.contrast-checker')
  const tc = useTranslations('tools.common')
  const [fg, setFg] = useState('#0b0b0b')
  const [bg, setBg] = useState('#64ff17')

  const ratio = useMemo(() => {
    const f = hexToRgb(fg)
    const b = hexToRgb(bg)
    if (!f || !b) return null
    return contrast(f, b)
  }, [fg, bg])

  const r = ratio ?? 0

  return (
    <div className="space-y-5">
      <div
        className="flex h-32 items-center justify-center rounded-2xl border border-border/50 text-lg font-semibold"
        style={{ backgroundColor: hexToRgb(bg) ? bg : '#fff', color: hexToRgb(fg) ? fg : '#000' }}
      >
        {tc('previewText')}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { label: t('textColor'), val: fg, set: setFg },
          { label: t('background'), val: bg, set: setBg },
        ].map((f) => (
          <div key={f.label} className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">{f.label}</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={hexToRgb(f.val) ? `#${hexToRgb(f.val)!.map((n) => n.toString(16).padStart(2, '0')).join('')}` : '#000000'}
                onChange={(e) => f.set(e.target.value)}
                className="h-10 w-12 cursor-pointer rounded-lg border border-border/60 bg-transparent"
                aria-label={f.label}
              />
              <ToolInput value={f.val} onChange={(e) => f.set(e.target.value)} />
            </div>
          </div>
        ))}
      </div>

      {ratio === null ? (
        <p className="text-sm text-destructive">{t('invalid')}</p>
      ) : (
        <>
          <div className="text-center">
            <p className="text-4xl font-extrabold tracking-tight">{r.toFixed(2)}:1</p>
            <p className="text-xs text-muted-foreground">{t('ratio')}</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Judgement label={t('aaNormal')} pass={r >= 4.5} />
            <Judgement label={t('aaLarge')} pass={r >= 3} />
            <Judgement label={t('aaaNormal')} pass={r >= 7} />
            <Judgement label={t('aaaLarge')} pass={r >= 4.5} />
          </div>
        </>
      )}
    </div>
  )
}
