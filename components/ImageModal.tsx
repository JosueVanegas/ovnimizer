'use client'

import { useEffect, useCallback } from 'react'
import { X, Download } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ImageItem, ProcessingOptions } from '@/types'
import { formatBytes } from '@/lib/utils'
import { getOutputFilename } from '@/lib/image-processor'
import { BeforeAfterSlider } from './BeforeAfterSlider'

interface ImageModalProps {
  image: ImageItem
  options: ProcessingOptions
  onClose: () => void
}

export function ImageModal({ image, options, onClose }: ImageModalProps) {
  const t = useTranslations('gallery')

  const saving =
    image.processedSize && image.originalSize > 0
      ? Math.round((1 - image.processedSize / image.originalSize) * 100)
      : null

  function handleDownload() {
    if (!image.processedBlob) return
    const url = URL.createObjectURL(image.processedBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = getOutputFilename(image.name, options.format)
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-card rounded-2xl border border-border/40 shadow-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
          aria-label={t('close')}
        >
          <X className="w-4 h-4" />
        </button>

        {image.status === 'done' && image.processedPreview ? (
          <BeforeAfterSlider
            before={image.preview}
            after={image.processedPreview}
            alt={image.name}
            beforeLabel={t('before')}
            afterLabel={t('after')}
          />
        ) : (
          <div className="bg-black flex items-center justify-center min-h-48">
            <img
              src={image.preview}
              alt={image.name}
              className="max-h-96 object-contain"
            />
          </div>
        )}

        <div className="p-4 space-y-3">
          <p className="font-semibold text-sm truncate">{image.name}</p>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
              <span>{formatBytes(image.originalSize)}</span>
              {image.processedSize && (
                <>
                  <span className="text-border/60">→</span>
                  <span className="text-foreground font-semibold">
                    {formatBytes(image.processedSize)}
                  </span>
                  {saving !== null && (
                    <span
                      className={[
                        'text-xs font-bold px-2 py-0.5 rounded-full',
                        saving > 0
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-orange-500/10 text-orange-500',
                      ].join(' ')}
                    >
                      {saving > 0 ? `-${saving}%` : `+${Math.abs(saving)}%`}
                    </span>
                  )}
                </>
              )}
            </div>
            {image.status === 'done' && (
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                {t('downloadAria')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
