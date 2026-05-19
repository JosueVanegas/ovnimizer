import { ImageFormat } from '@/types'

export function getMimeType(format: ImageFormat): string {
  const map: Record<ImageFormat, string> = {
    png:  'image/png',
    jpg:  'image/jpeg',
    webp: 'image/webp',
    avif: 'image/avif',
    ico:  'image/x-icon',
  }
  return map[format]
}

export function getOutputFilename(originalName: string, format: ImageFormat): string {
  const base = originalName.replace(/\.[^.]+$/, '')
  const ext = format === 'jpg' ? 'jpg' : format
  return `${base}.${ext}`
}
