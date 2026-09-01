'use client'

import { useMemo, useState } from 'react'
import { Plus, X, RefreshCw } from 'lucide-react'
import { CopyButton } from '../ui'

interface Stop {
  id: number
  color: string
  pos: number
}

let nextId = 3
const randColor = () =>
  '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')

export function GradientGenerator() {
  const [type, setType] = useState<'linear' | 'radial'>('linear')
  const [angle, setAngle] = useState(90)
  const [stops, setStops] = useState<Stop[]>([
    { id: 1, color: '#64ff17', pos: 0 },
    { id: 2, color: '#0ea5e9', pos: 100 },
  ])

  const css = useMemo(() => {
    const sorted = [...stops].sort((a, b) => a.pos - b.pos)
    const list = sorted.map((s) => `${s.color} ${s.pos}%`).join(', ')
    return type === 'linear'
      ? `linear-gradient(${angle}deg, ${list})`
      : `radial-gradient(circle, ${list})`
  }, [type, angle, stops])

  const update = (id: number, patch: Partial<Stop>) =>
    setStops((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))

  return (
    <div className="space-y-5">
      <div className="h-40 rounded-2xl border border-border/50" style={{ background: css }} aria-hidden />

      <div className="flex items-center justify-between gap-2 rounded-xl border border-border/50 bg-muted/20 p-3">
        <code className="break-all font-mono text-sm">background: {css};</code>
        <CopyButton value={`background: ${css};`} className="shrink-0" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/40 p-0.5 text-xs">
          {(['linear', 'radial'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`rounded-md px-3 py-1 font-semibold capitalize transition-colors ${
                type === t ? 'bg-ufo-green text-black' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        {type === 'linear' && (
          <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            Angle
            <input
              type="range"
              min={0}
              max={360}
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="accent-[var(--ufo-green)]"
            />
            <span className="w-10 font-mono tabular-nums">{angle}°</span>
          </label>
        )}
      </div>

      <div className="space-y-2">
        {stops.map((s) => (
          <div key={s.id} className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/10 p-2.5">
            <input
              type="color"
              value={s.color}
              onChange={(e) => update(s.id, { color: e.target.value })}
              className="h-8 w-10 cursor-pointer rounded border border-border/60 bg-transparent"
              aria-label="Stop color"
            />
            <code className="w-20 font-mono text-xs">{s.color}</code>
            <input
              type="range"
              min={0}
              max={100}
              value={s.pos}
              onChange={(e) => update(s.id, { pos: Number(e.target.value) })}
              className="flex-1 accent-[var(--ufo-green)]"
            />
            <span className="w-10 text-right font-mono text-xs tabular-nums">{s.pos}%</span>
            <button
              onClick={() => setStops((prev) => (prev.length > 2 ? prev.filter((x) => x.id !== s.id) : prev))}
              disabled={stops.length <= 2}
              className="text-muted-foreground transition-colors hover:text-destructive disabled:opacity-30"
              aria-label="Remove stop"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setStops((prev) => [...prev, { id: nextId++, color: randColor(), pos: 50 }])}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/40 px-3 py-1.5 text-xs font-semibold hover:bg-muted/70"
        >
          <Plus className="h-3.5 w-3.5" /> Add stop
        </button>
        <button
          onClick={() => setStops((prev) => prev.map((s) => ({ ...s, color: randColor() })))}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/40 px-3 py-1.5 text-xs font-semibold hover:bg-muted/70"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Randomize
        </button>
      </div>
    </div>
  )
}
