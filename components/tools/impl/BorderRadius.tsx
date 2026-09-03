'use client'

import { useMemo, useState } from 'react'
import { Link2, Unlink } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { CopyButton } from '../ui'

type Corner = 'tl' | 'tr' | 'br' | 'bl'
const CORNERS: { key: Corner; label: string }[] = [
  { key: 'tl', label: 'topLeft' },
  { key: 'tr', label: 'topRight' },
  { key: 'br', label: 'bottomRight' },
  { key: 'bl', label: 'bottomLeft' },
]

export function BorderRadius() {
  const t = useTranslations('tools.border-radius')
  const [linked, setLinked] = useState(true)
  const [unit, setUnit] = useState<'px' | '%'>('px')
  const [values, setValues] = useState<Record<Corner, number>>({ tl: 24, tr: 24, br: 24, bl: 24 })

  const max = unit === '%' ? 50 : 200

  const css = useMemo(() => {
    const { tl, tr, br, bl } = values
    const u = unit
    if (tl === tr && tr === br && br === bl) return `${tl}${u}`
    return `${tl}${u} ${tr}${u} ${br}${u} ${bl}${u}`
  }, [values, unit])

  function setCorner(key: Corner, val: number) {
    setValues((prev) => (linked ? { tl: val, tr: val, br: val, bl: val } : { ...prev, [key]: val }))
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="flex items-center justify-center rounded-2xl border border-border/50 bg-muted/20 p-6">
        <div
          className="h-48 w-full max-w-sm bg-ufo-green/80"
          style={{ borderRadius: `${values.tl}${unit} ${values.tr}${unit} ${values.br}${unit} ${values.bl}${unit}` }}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLinked((v) => !v)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
              linked ? 'border-ufo-green/50 bg-ufo-green/10 text-ufo-green' : 'border-border/60 bg-muted/40'
            }`}
          >
            {linked ? <Link2 className="h-3.5 w-3.5" /> : <Unlink className="h-3.5 w-3.5" />}
            {linked ? t('linked') : t('independent')}
          </button>
          <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/40 p-0.5 text-xs">
            {(['px', '%'] as const).map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={`rounded-md px-2.5 py-1 font-semibold transition-colors ${
                  unit === u ? 'bg-ufo-green text-black' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        {(linked ? [CORNERS[0]] : CORNERS).map(({ key, label }) => (
          <div key={key} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-muted-foreground">{linked ? t('allCorners') : t(label)}</span>
              <span className="font-mono tabular-nums">{values[key]}{unit}</span>
            </div>
            <input
              type="range"
              min={0}
              max={max}
              value={values[key]}
              onChange={(e) => setCorner(key, Number(e.target.value))}
              className="w-full accent-[var(--ufo-green)]"
            />
          </div>
        ))}

        <div className="flex items-center justify-between gap-2 rounded-xl border border-border/50 bg-muted/20 p-3">
          <code className="break-all font-mono text-xs">border-radius: {css};</code>
          <CopyButton value={`border-radius: ${css};`} className="shrink-0" />
        </div>
      </div>
    </div>
  )
}
