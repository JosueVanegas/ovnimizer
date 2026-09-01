'use client'

import { useMemo, useState } from 'react'
import { CopyButton, ToolInput } from '../ui'
import { hexToRgb, rgbToHsl, hslToHex } from '@/lib/tools/color'

// Tailwind-like lightness targets per stop.
const STOPS: [number, number][] = [
  [50, 97],
  [100, 94],
  [200, 86],
  [300, 77],
  [400, 66],
  [500, 55],
  [600, 47],
  [700, 39],
  [800, 31],
  [900, 24],
  [950, 15],
]

export function TailwindPalette() {
  const [hex, setHex] = useState('#64ff17')
  const [name, setName] = useState('brand')

  const palette = useMemo(() => {
    const rgb = hexToRgb(hex)
    if (!rgb) return null
    const [h, s] = rgbToHsl(rgb)
    return STOPS.map(([stop, l]) => [stop, hslToHex([h, s, l])] as [number, string])
  }, [hex])

  const config = useMemo(() => {
    if (!palette) return ''
    const lines = palette.map(([stop, c]) => `      ${stop}: '${c}',`).join('\n')
    return `colors: {\n  ${name || 'brand'}: {\n${lines}\n  },\n}`
  }, [palette, name])

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">Base color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={hexToRgb(hex) ? hex : '#000000'}
              onChange={(e) => setHex(e.target.value)}
              className="h-10 w-12 cursor-pointer rounded-lg border border-border/60 bg-transparent"
              aria-label="Base color"
            />
            <ToolInput value={hex} onChange={(e) => setHex(e.target.value)} className="w-32" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">Name</label>
          <ToolInput value={name} onChange={(e) => setName(e.target.value)} className="w-32" />
        </div>
      </div>

      {!palette ? (
        <p className="text-sm text-destructive">Enter a valid hex color.</p>
      ) : (
        <>
          <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-11">
            {palette.map(([stop, color]) => (
              <div key={stop} className="space-y-1 text-center">
                <div className="h-14 rounded-lg border border-border/40" style={{ backgroundColor: color }} />
                <p className="text-[10px] font-semibold text-muted-foreground">{stop}</p>
                <code className="block text-[9px] text-muted-foreground">{color}</code>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground">tailwind.config</label>
              <CopyButton value={config} />
            </div>
            <pre className="overflow-x-auto rounded-xl border border-border/50 bg-muted/20 p-3 font-mono text-xs">{config}</pre>
          </div>
        </>
      )}
    </div>
  )
}
