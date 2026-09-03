'use client'

import { useState } from 'react'
import { Pipette } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { CopyButton, ToolInput } from '../ui'
import { hexToRgb, rgbToHsl } from '@/lib/tools/color'

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-muted/20 px-3 py-2.5">
      <div>
        <p className="text-xs font-semibold text-muted-foreground">{label}</p>
        <code className="font-mono text-sm">{value}</code>
      </div>
      <CopyButton value={value} label="" />
    </div>
  )
}

export function ColorPicker() {
  const t = useTranslations('tools.color-picker')
  const [hex, setHex] = useState('#64ff17')
  const rgb = hexToRgb(hex)
  const normalized = rgb ? '#' + rgb.map((n) => n.toString(16).padStart(2, '0')).join('') : '#000000'
  const hsl = rgb ? rgbToHsl(rgb) : null
  const hasEyeDropper = typeof window !== 'undefined' && 'EyeDropper' in window

  async function pick() {
    try {
      // EyeDropper API (Chromium). Not in TS lib types yet.
      const ep = new (window as unknown as { EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> } }).EyeDropper()
      const { sRGBHex } = await ep.open()
      setHex(sRGBHex)
    } catch {
      /* user cancelled */
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <div className="space-y-3">
        <div className="h-40 rounded-2xl border border-border/50" style={{ backgroundColor: normalized }} />
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={normalized}
            onChange={(e) => setHex(e.target.value)}
            className="h-10 w-12 cursor-pointer rounded-lg border border-border/60 bg-transparent"
            aria-label="Color picker"
          />
          <ToolInput value={hex} onChange={(e) => setHex(e.target.value)} />
        </div>
        {hasEyeDropper && (
          <button
            onClick={pick}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border/60 bg-muted/40 px-3 py-2 text-xs font-semibold hover:bg-muted/70"
          >
            <Pipette className="h-3.5 w-3.5" /> {t('pickFromScreen')}
          </button>
        )}
      </div>

      <div className="space-y-3">
        {rgb && hsl ? (
          <>
            <Row label={t('hex')} value={normalized} />
            <Row label={t('rgb')} value={`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`} />
            <Row label={t('hsl')} value={`hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`} />
            <Row label={t('cssVariable')} value={`--color: ${normalized};`} />
          </>
        ) : (
          <p className="text-sm text-destructive">{t('invalid')}</p>
        )}
      </div>
    </div>
  )
}
