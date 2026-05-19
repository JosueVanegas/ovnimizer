'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Archive, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ImageItem, ImageFormat } from '@/types'
import { downloadZip } from '@/lib/zip-handler'
import { formatBytes } from '@/lib/utils'

interface ActionButtonsProps {
  images: ImageItem[]
  format: ImageFormat
}

export function ActionButtons({ images, format }: ActionButtonsProps) {
  const t = useTranslations('stats')
  const [zipping, setZipping] = useState(false)

  const done = images.filter((i) => i.status === 'done' && i.processedBlob)
  if (!done.length) return null

  const totalOriginal = done.reduce((s, i) => s + i.originalSize, 0)
  const totalProcessed = done.reduce((s, i) => s + (i.processedSize ?? 0), 0)
  const saving = totalOriginal > 0 ? Math.round((1 - totalProcessed / totalOriginal) * 100) : 0
  const savedBytes = totalOriginal - totalProcessed

  async function handleZip() {
    setZipping(true)
    try {
      await downloadZip(done, format)
    } finally {
      setZipping(false)
    }
  }

  return (
    <div className="rounded-2xl border border-border/40 bg-card p-5 space-y-5">
      <div className="grid grid-cols-4 divide-x divide-border/40 text-center">
        <div className="pr-3">
          <p className="text-2xl font-extrabold tabular-nums">{done.length}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {done.length === 1 ? t('image') : t('images')}
          </p>
        </div>
        <div className="px-3">
          <p className="text-lg font-extrabold tabular-nums text-muted-foreground">
            {formatBytes(totalOriginal)}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{t('original')}</p>
        </div>
        <div className="px-3">
          <p
            className={[
              'text-2xl font-extrabold tabular-nums',
              saving > 0 ? 'text-ufo-green' : 'text-muted-foreground',
            ].join(' ')}
          >
            {saving > 0 ? `-${saving}%` : `+${Math.abs(saving)}%`}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{t('compression')}</p>
        </div>
        <div className="pl-3">
          <p className="text-2xl font-extrabold tabular-nums">
            {savedBytes > 0 ? formatBytes(savedBytes) : '—'}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{t('saved')}</p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <span>{formatBytes(totalOriginal)}</span>
        <ArrowRight className="w-3.5 h-3.5 text-ufo-green" />
        <span className="text-foreground font-semibold">{formatBytes(totalProcessed)}</span>
      </div>

      <Button
        className="w-full bg-ufo-green hover:bg-ufo-green/85 text-black gap-2"
        size="lg"
        onClick={handleZip}
        disabled={zipping}
      >
        <Archive className="w-4 h-4" />
        {zipping
          ? t('zipping')
          : `${t('downloadZip')} · ${done.length} ${done.length === 1 ? t('image') : t('images')}`}
      </Button>
    </div>
  )
}
