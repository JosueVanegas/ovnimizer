'use client'

import { useTranslations } from 'next-intl'
import { ProcessingOptions, ImageFormat } from '@/types'
import { FORMATS, QUALITY_PRESETS, RESIZE_PRESETS } from '@/lib/constants'
import { Slider } from '@/components/ui/slider'
import { Gem, TrendingUp, Equal, Zap, Minimize2, type LucideIcon } from 'lucide-react'

const PRESET_ICONS: Record<typeof QUALITY_PRESETS[number]['key'], LucideIcon> = {
  max:        Gem,
  high:       TrendingUp,
  balanced:   Equal,
  aggressive: Zap,
  minimum:    Minimize2,
}

interface ProcessingOptionsProps {
  options: ProcessingOptions
  onChange: (opts: ProcessingOptions) => void
  disabled?: boolean
}

export function ProcessingOptionsPanel({ options, onChange, disabled }: ProcessingOptionsProps) {
  const t = useTranslations('options')
  const update = (patch: Partial<ProcessingOptions>) => onChange({ ...options, ...patch })

  const btnBase     = 'px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide transition-colors'
  const btnActive   = 'bg-emerald-500 text-white shadow-sm'
  const btnIdle     = 'bg-muted hover:bg-muted/70 text-muted-foreground'
  const btnDisabled = 'opacity-50 cursor-not-allowed'

  return (
    <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-6">
      <div className="space-y-2.5">
        <label className="text-sm font-semibold">{t('format')}</label>
        <div className="flex gap-2 flex-wrap">
          {FORMATS.map((fmt) => (
            <button
              key={fmt}
              onClick={() => update({ format: fmt as ImageFormat })}
              disabled={disabled}
              className={[
                btnBase,
                options.format === fmt ? btnActive : btnIdle,
                disabled && btnDisabled,
              ].filter(Boolean).join(' ')}
            >
              {fmt}
            </button>
          ))}
        </div>
        {options.format === 'avif' && (
          <p className="text-[11px] text-amber-500 dark:text-amber-400">{t('avifWarning')}</p>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold">{t('quality')}</label>
          <span className="text-sm font-mono tabular-nums text-muted-foreground">
            {options.quality}%
          </span>
        </div>
        <Slider
          value={[options.quality]}
          min={1}
          max={100}
          step={1}
          onValueChange={(val) => update({ quality: Array.isArray(val) ? val[0] : val })}
          disabled={disabled}
          className="w-full"
        />
        <div className="flex gap-1.5 flex-wrap">
          {QUALITY_PRESETS.map(({ key, value }) => {
            const Icon = PRESET_ICONS[key]
            const active = options.quality === value
            return (
              <button
                key={key}
                onClick={() => update({ quality: value })}
                disabled={disabled}
                className={[
                  'flex-1 min-w-0 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-semibold transition-colors',
                  active
                    ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/20 dark:text-emerald-400 ring-1 ring-emerald-500/30'
                    : 'bg-muted hover:bg-muted/70 text-muted-foreground',
                  disabled ? btnDisabled : '',
                ].filter(Boolean).join(' ')}
              >
                <Icon className="w-3 h-3 shrink-0" />
                <span className="truncate">
                  {t(`preset.${key}` as Parameters<typeof t>[0])}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-2.5">
        <label className="text-sm font-semibold">{t('maxWidth')}</label>
        <div className="flex gap-2 flex-wrap">
          {RESIZE_PRESETS.map(({ key, value }) => (
            <button
              key={key}
              onClick={() => update({ width: value })}
              disabled={disabled}
              className={[
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                options.width === value ? btnActive : btnIdle,
                disabled && btnDisabled,
              ].filter(Boolean).join(' ')}
            >
              {t(`size.${key}` as Parameters<typeof t>[0])}
              {value && <span className="ml-1 opacity-60">{value}px</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
