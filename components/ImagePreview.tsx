'use client'

import { useState } from 'react'
import { X, Download, Loader2, AlertCircle, Trash2, ScanSearch } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ImageItem, ProcessingOptions } from '@/types'
import { Badge } from '@/components/ui/badge'
import { formatBytes } from '@/lib/utils'
import { getOutputFilename } from '@/lib/image-processor'
import { ImageModal } from './ImageModal'

interface ImagePreviewProps {
  images: ImageItem[]
  options: ProcessingOptions
  onRemove: (id: string) => void
  onClear: () => void
  disabled?: boolean
}

export function ImagePreview({ images, options, onRemove, onClear, disabled }: ImagePreviewProps) {
  const t = useTranslations('gallery')
  const [modalImage, setModalImage] = useState<ImageItem | null>(null)

  if (!images.length) return null

  const doneCount = images.filter((i) => i.status === 'done').length
  const count = images.length

  function downloadOne(img: ImageItem) {
    if (!img.processedBlob) return
    const url = URL.createObjectURL(img.processedBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = getOutputFilename(img.name, options.format)
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground">
            {count} {count === 1 ? t('image') : t('images')}
            {doneCount > 0 && (
              <span className="ml-2 text-emerald-600 dark:text-emerald-400">
                · {doneCount} {doneCount === 1 ? t('processed') : t('processedPlural')}
              </span>
            )}
          </h2>
          <button
            onClick={onClear}
            disabled={disabled}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40"
            aria-label="Clear all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {images.map((img, idx) => {
            const saving =
              img.processedSize && img.originalSize > 0
                ? Math.round((1 - img.processedSize / img.originalSize) * 100)
                : null

            return (
              <div
                key={img.id}
                className="group relative rounded-xl overflow-hidden bg-muted aspect-square border border-border/40 animate-card-appear"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <img
                  src={img.processedPreview ?? img.preview}
                  alt={img.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />

                {img.status === 'processing' && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}

                {img.status === 'error' && (
                  <div className="absolute inset-0 bg-red-900/70 flex flex-col items-center justify-center gap-1.5 px-2">
                    <AlertCircle className="w-5 h-5 text-red-200 shrink-0" />
                    <span className="text-[10px] text-red-200 text-center line-clamp-3 leading-tight">
                      {img.errorMessage ?? 'Error'}
                    </span>
                  </div>
                )}

                {img.status === 'done' && saving !== null && (
                  <div className="absolute top-1.5 left-1.5">
                    <Badge
                      className={[
                        'text-[10px] h-4 px-1.5 font-bold pointer-events-none border-0',
                        saving > 0
                          ? 'bg-emerald-500 hover:bg-emerald-500 text-white'
                          : 'bg-orange-500 hover:bg-orange-500 text-white',
                      ].join(' ')}
                    >
                      {saving > 0 ? `-${saving}%` : `+${Math.abs(saving)}%`}
                    </Badge>
                  </div>
                )}

                {img.status !== 'processing' && (
                  <>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-200" />

                    <button
                      onClick={() => !disabled && onRemove(img.id)}
                      disabled={disabled}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                      aria-label={t('removeAria')}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    {img.status === 'done' && (
                      <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setModalImage(img)}
                          className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-400 transition-colors shadow-lg"
                          aria-label={t('compareAria')}
                        >
                          <ScanSearch className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => downloadOne(img)}
                          className="w-8 h-8 rounded-full bg-white/25 backdrop-blur text-white flex items-center justify-center hover:bg-white/40 transition-colors shadow-lg"
                          aria-label={t('downloadAria')}
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-linear-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <p className="text-xs text-white truncate font-semibold">{img.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[10px] text-white/60">{formatBytes(img.originalSize)}</span>
                        {img.processedSize && (
                          <>
                            <span className="text-[10px] text-white/30">→</span>
                            <span className="text-[10px] text-emerald-300 font-medium">
                              {formatBytes(img.processedSize)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {modalImage && (
        <ImageModal
          image={modalImage}
          options={options}
          onClose={() => setModalImage(null)}
        />
      )}
    </>
  )
}
