'use client'

import { useMemo, useState } from 'react'
import { CopyButton, ToolInput } from '../ui'

function hexToRgb(hex: string): [number, number, number] | null {
  let h = hex.replace('#', '').trim()
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  const l = (max + min) / 2
  const d = max - min
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)]
}

function Field({ label, value }: { label: string; value: string }) {
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

export function HexRgb() {
  const [hex, setHex] = useState('#64ff17')
  const rgb = useMemo(() => hexToRgb(hex), [hex])
  const normalizedHex = rgb ? `#${rgb.map((n) => n.toString(16).padStart(2, '0')).join('')}` : '#000000'
  const hsl = rgb ? rgbToHsl(...rgb) : null

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={normalizedHex}
          onChange={(e) => setHex(e.target.value)}
          className="h-12 w-16 cursor-pointer rounded-lg border border-border/60 bg-transparent"
          aria-label="Color picker"
        />
        <div className="flex-1">
          <label className="text-xs font-semibold text-muted-foreground">HEX</label>
          <ToolInput value={hex} onChange={(e) => setHex(e.target.value)} placeholder="#64ff17" />
        </div>
      </div>

      {!rgb && hex.trim() && <p className="text-sm text-destructive">Enter a valid 3- or 6-digit hex color.</p>}

      {rgb && hsl && (
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="HEX" value={normalizedHex} />
          <Field label="RGB" value={`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`} />
          <Field label="HSL" value={`hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`} />
        </div>
      )}

      {rgb && (
        <div
          className="h-24 rounded-2xl border border-border/50"
          style={{ backgroundColor: normalizedHex }}
          aria-hidden
        />
      )}
    </div>
  )
}
