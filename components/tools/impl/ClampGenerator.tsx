'use client'

import { useMemo, useState } from 'react'
import { CopyButton, ToolInput } from '../ui'

const round = (n: number) => Math.round(n * 10000) / 10000

export function ClampGenerator() {
  const [minVw, setMinVw] = useState(320)
  const [maxVw, setMaxVw] = useState(1280)
  const [minSize, setMinSize] = useState(16)
  const [maxSize, setMaxSize] = useState(24)
  const [root, setRoot] = useState(16)

  const result = useMemo(() => {
    if (maxVw === minVw) return null
    const slope = (maxSize - minSize) / (maxVw - minVw)
    const yIntercept = minSize - slope * minVw
    const preferredVw = round(slope * 100)
    const interceptRem = round(yIntercept / root)
    const minRem = round(minSize / root)
    const maxRem = round(maxSize / root)
    const lo = Math.min(minRem, maxRem)
    const hi = Math.max(minRem, maxRem)
    return {
      css: `clamp(${lo}rem, ${interceptRem}rem + ${preferredVw}vw, ${hi}rem)`,
      preferredVw,
      interceptRem,
    }
  }, [minVw, maxVw, minSize, maxSize, root])

  const fields: { label: string; value: number; set: (n: number) => void; suffix: string }[] = [
    { label: 'Min viewport', value: minVw, set: setMinVw, suffix: 'px' },
    { label: 'Max viewport', value: maxVw, set: setMaxVw, suffix: 'px' },
    { label: 'Min size', value: minSize, set: setMinSize, suffix: 'px' },
    { label: 'Max size', value: maxSize, set: setMaxSize, suffix: 'px' },
    { label: 'Root font size', value: root, set: setRoot, suffix: 'px' },
  ]

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {fields.map((f) => (
          <div key={f.label} className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">{f.label}</label>
            <div className="relative">
              <ToolInput
                type="number"
                value={f.value}
                onChange={(e) => f.set(Number(e.target.value))}
                className="pr-8"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                {f.suffix}
              </span>
            </div>
          </div>
        ))}
      </div>

      {!result ? (
        <p className="text-sm text-destructive">Min and max viewport must differ.</p>
      ) : (
        <>
          <div className="flex items-center justify-between gap-2 rounded-xl border border-border/50 bg-muted/20 p-3">
            <code className="break-all font-mono text-sm">font-size: {result.css};</code>
            <CopyButton value={`font-size: ${result.css};`} className="shrink-0" />
          </div>
          <div className="rounded-2xl border border-border/50 bg-muted/10 p-6">
            <p className="mb-1 text-xs text-muted-foreground">Live preview (resize the window):</p>
            <p style={{ fontSize: result.css }} className="font-bold leading-tight">
              The quick brown fox
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Fluidly scales from {minSize}px at {minVw}px wide to {maxSize}px at {maxVw}px wide, using rem
            for accessibility.
          </p>
        </>
      )}
    </div>
  )
}
