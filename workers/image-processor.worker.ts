/// <reference lib="webworker" />

import type { ProcessingOptions } from '../types'

function getMimeType(format: string): string {
  const map: Record<string, string> = {
    png:  'image/png',
    jpg:  'image/jpeg',
    webp: 'image/webp',
    avif: 'image/avif',
  }
  return map[format] ?? 'image/webp'
}

async function buildIco(canvas: OffscreenCanvas, w: number, h: number): Promise<Blob> {
  const png = await canvas.convertToBlob({ type: 'image/png' })
  const pngData = new Uint8Array(await png.arrayBuffer())

  const headerSize = 6 + 16
  const buf = new ArrayBuffer(headerSize + pngData.length)
  const view = new DataView(buf)

  view.setUint16(0, 0, true)
  view.setUint16(2, 1, true)
  view.setUint16(4, 1, true)

  view.setUint8(6,  w < 256 ? w : 0)
  view.setUint8(7,  h < 256 ? h : 0)
  view.setUint8(8,  0)
  view.setUint8(9,  0)
  view.setUint16(10, 1,  true)
  view.setUint16(12, 32, true)
  view.setUint32(14, pngData.length, true)
  view.setUint32(18, headerSize,     true)

  new Uint8Array(buf).set(pngData, headerSize)

  return new Blob([buf], { type: 'image/x-icon' })
}

async function processWithCanvas(
  file: File,
  options: ProcessingOptions,
  onProgress: (pct: number) => void
): Promise<Blob> {
  onProgress(10)

  const bitmap = await createImageBitmap(file)
  onProgress(30)

  let w = bitmap.width
  let h = bitmap.height
  if (options.width && w > options.width) {
    h = Math.round(h * (options.width / w))
    w = options.width
  }

  const canvas = new OffscreenCanvas(w, h)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('OffscreenCanvas no disponible')

  ctx.drawImage(bitmap, 0, 0, w, h)
  bitmap.close()
  onProgress(70)

  if (options.format === 'ico') {
    onProgress(85)
    const icoBlob = await buildIco(canvas, w, h)
    onProgress(100)
    return icoBlob
  }

  const mime = getMimeType(options.format)
  const quality = options.format === 'png' ? undefined : options.quality / 100

  let blob: Blob
  try {
    blob = await canvas.convertToBlob({ type: mime, quality })
    if (options.format !== 'png' && blob.type === 'image/png') {
      throw new Error('format_unsupported')
    }
  } catch {
    if (options.format === 'avif') {
      blob = await canvas.convertToBlob({ type: 'image/webp', quality })
    } else {
      throw new Error(`${options.format.toUpperCase()} no soportado en este navegador`)
    }
  }

  if (!blob || blob.size === 0) {
    throw new Error(`Error codificando imagen como ${options.format}`)
  }

  onProgress(100)
  return blob
}

self.onmessage = async (e: MessageEvent) => {
  const { id, file, options } = e.data as {
    id: string
    file: File
    options: ProcessingOptions
  }

  try {
    const blob = await processWithCanvas(file, options, (pct) => {
      self.postMessage({ type: 'PROGRESS', id, value: pct })
    })
    self.postMessage({ type: 'COMPLETE', id, blob })
  } catch (err) {
    self.postMessage({ type: 'ERROR', id, error: String(err) })
  }
}
