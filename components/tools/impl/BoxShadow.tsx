'use client'

import { useMemo, useState } from 'react'
import { CopyButton } from '../ui'

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

const CONTROLS: { key: 'x' | 'y' | 'blur' | 'spread'; label: string; min: number; max: number }[] = [
  { key: 'x', label: 'Offset X', min: -50, max: 50 },
  { key: 'y', label: 'Offset Y', min: -50, max: 50 },
  { key: 'blur', label: 'Blur', min: 0, max: 100 },
  { key: 'spread', label: 'Spread', min: -50, max: 50 },
]

export function BoxShadow() {
  const [vals, setVals] = useState({ x: 0, y: 12, blur: 30, spread: -6 })
  const [color, setColor] = useState('#0b0b0b')
  const [alpha, setAlpha] = useState(0.25)
  const [inset, setInset] = useState(false)

  const css = useMemo(() => {
    const [r, g, b] = hexToRgb(color)
    const rgba = `rgba(${r}, ${g}, ${b}, ${alpha})`
    return `${inset ? 'inset ' : ''}${vals.x}px ${vals.y}px ${vals.blur}px ${vals.spread}px ${rgba}`
  }, [vals, color, alpha, inset])

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="flex items-center justify-center rounded-2xl border border-border/50 bg-muted/20 p-10">
        <div className="h-40 w-full max-w-xs rounded-2xl bg-card" style={{ boxShadow: css }} />
      </div>

      <div className="space-y-4">
        {CONTROLS.map((c) => (
          <div key={c.key} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-muted-foreground">{c.label}</span>
              <span className="font-mono tabular-nums">{vals[c.key]}px</span>
            </div>
            <input
              type="range"
              min={c.min}
              max={c.max}
              value={vals[c.key]}
              onChange={(e) => setVals((p) => ({ ...p, [c.key]: Number(e.target.value) }))}
              className="w-full accent-[var(--ufo-green)]"
            />
          </div>
        ))}

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-muted-foreground">Opacity</span>
            <span className="font-mono tabular-nums">{alpha}</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={alpha}
            onChange={(e) => setAlpha(Number(e.target.value))}
            className="w-full accent-[var(--ufo-green)]"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-9 w-12 cursor-pointer rounded-lg border border-border/60 bg-transparent"
            aria-label="Shadow color"
          />
          <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <input type="checkbox" checked={inset} onChange={(e) => setInset(e.target.checked)} className="accent-[var(--ufo-green)]" />
            inset
          </label>
        </div>

        <div className="flex items-center justify-between gap-2 rounded-xl border border-border/50 bg-muted/20 p-3">
          <code className="break-all font-mono text-xs">box-shadow: {css};</code>
          <CopyButton value={`box-shadow: ${css};`} className="shrink-0" />
        </div>
      </div>
    </div>
  )
}
