import { OutputFormat } from '@/types'

export type FormatCategory = 'web' | 'raster' | 'lossless' | 'icon'

export interface FormatInfo {
  /** Canonical lossy/lossless behaviour — drives whether quality applies. */
  lossless: boolean
  cat: FormatCategory
  mime: string
  ext: string
}

export const OUTPUT_FORMATS: Record<OutputFormat, FormatInfo> = {
  webp: { lossless: false, cat: 'web',      mime: 'image/webp',   ext: 'webp' },
  avif: { lossless: false, cat: 'web',      mime: 'image/avif',   ext: 'avif' },
  jpg:  { lossless: false, cat: 'web',      mime: 'image/jpeg',   ext: 'jpg'  },
  png:  { lossless: true,  cat: 'lossless', mime: 'image/png',    ext: 'png'  },
  tiff: { lossless: true,  cat: 'raster',   mime: 'image/tiff',   ext: 'tiff' },
  bmp:  { lossless: true,  cat: 'raster',   mime: 'image/bmp',    ext: 'bmp'  },
  ico:  { lossless: true,  cat: 'icon',     mime: 'image/x-icon', ext: 'ico'  },
}

// Order shown in the picker (AVIF/WebP preferred first, per product spec).
export const OUTPUT_FORMAT_ORDER: OutputFormat[] = [
  'webp', 'avif', 'jpg', 'png', 'tiff', 'bmp', 'ico',
]

export function getMimeType(format: OutputFormat): string {
  return OUTPUT_FORMATS[format].mime
}

export function isLossless(format: OutputFormat): boolean {
  return OUTPUT_FORMATS[format].lossless
}

/** Map an input File's mime/extension to the format we'd keep when "keep original" is chosen. */
export function detectSourceFormat(file: File): OutputFormat {
  const mime = file.type.toLowerCase()
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''

  if (mime.includes('png') || ext === 'png') return 'png'
  if (mime.includes('webp') || ext === 'webp') return 'webp'
  if (mime.includes('avif') || ext === 'avif') return 'avif'
  if (mime.includes('tiff') || ext === 'tif' || ext === 'tiff') return 'tiff'
  if (mime.includes('bmp') || ext === 'bmp') return 'bmp'
  if (mime.includes('x-icon') || mime.includes('vnd.microsoft.icon') || ext === 'ico') return 'ico'
  // gif / svg / heic / jpeg and anything else collapse to a safe raster target.
  if (mime.includes('gif') || ext === 'gif') return 'png'
  if (mime.includes('svg') || ext === 'svg') return 'png'
  // jpeg, heic (decoded to jpeg), jfif, unknown
  return 'jpg'
}

export function getOutputFilename(originalName: string, format: OutputFormat): string {
  const base = originalName.replace(/\.[^.]+$/, '')
  return `${base}.${OUTPUT_FORMATS[format].ext}`
}
