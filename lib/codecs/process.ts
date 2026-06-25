/// <reference lib="webworker" />

import * as UTIF from 'utif2'
import type { OutputFormat, ProcessingOptions } from '@/types'
import { detectSourceFormat, getMimeType, isLossless } from '@/lib/formats'

export interface ProcessResult {
  blob: Blob
  format: OutputFormat
}

/** Resolve 'keep' (optimize mode) to a concrete encodeable format. */
export function resolveOutputFormat(file: File, options: ProcessingOptions): OutputFormat {
  if (options.format === 'keep') return detectSourceFormat(file)
  return options.format
}

function isTiff(file: File): boolean {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  return file.type.includes('tiff') || ext === 'tif' || ext === 'tiff'
}

/** Decode any supported input into an ImageBitmap (handles TIFF via utif2). */
async function decode(file: File): Promise<ImageBitmap> {
  if (isTiff(file)) {
    const buf = await file.arrayBuffer()
    const ifds = UTIF.decode(buf)
    if (!ifds.length) throw new Error('decode_failed')
    UTIF.decodeImage(buf, ifds[0])
    const rgba = UTIF.toRGBA8(ifds[0])
    const w = ifds[0].width
    const h = ifds[0].height
    const clamped = new Uint8ClampedArray(rgba.length)
    clamped.set(rgba)
    const data = new ImageData(clamped, w, h)
    return createImageBitmap(data)
  }
  try {
    return await createImageBitmap(file)
  } catch {
    throw new Error('decode_failed')
  }
}

function getImageData(canvas: OffscreenCanvas): ImageData {
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('OffscreenCanvas unavailable')
  return ctx.getImageData(0, 0, canvas.width, canvas.height)
}

// ---- Raster encoders the browser Canvas can't produce ---------------------

/** 24-bit bottom-up BMP (alpha is flattened — BMP has no standard alpha). */
function encodeBmp(img: ImageData): Blob {
  const { width: w, height: h, data } = img
  const rowSize = Math.floor((24 * w + 31) / 32) * 4
  const pixelArraySize = rowSize * h
  const fileSize = 54 + pixelArraySize
  const buf = new ArrayBuffer(fileSize)
  const view = new DataView(buf)

  // BITMAPFILEHEADER
  view.setUint16(0, 0x4d42, true)        // "BM"
  view.setUint32(2, fileSize, true)
  view.setUint32(10, 54, true)           // pixel data offset
  // BITMAPINFOHEADER
  view.setUint32(14, 40, true)
  view.setInt32(18, w, true)
  view.setInt32(22, h, true)             // positive => bottom-up
  view.setUint16(26, 1, true)
  view.setUint16(28, 24, true)
  view.setUint32(34, pixelArraySize, true)

  const bytes = new Uint8Array(buf)
  for (let y = 0; y < h; y++) {
    const srcRow = (h - 1 - y) * w * 4
    let dst = 54 + y * rowSize
    for (let x = 0; x < w; x++) {
      const s = srcRow + x * 4
      bytes[dst++] = data[s + 2] // B
      bytes[dst++] = data[s + 1] // G
      bytes[dst++] = data[s]     // R
    }
  }
  return new Blob([buf], { type: 'image/bmp' })
}

function encodeTiff(img: ImageData): Blob {
  const rgba = new Uint8Array(img.data.buffer, img.data.byteOffset, img.data.byteLength)
  const ab = UTIF.encodeImage(rgba, img.width, img.height)
  return new Blob([ab], { type: 'image/tiff' })
}

async function encodeIco(canvas: OffscreenCanvas): Promise<Blob> {
  const png = await canvas.convertToBlob({ type: 'image/png' })
  const pngData = new Uint8Array(await png.arrayBuffer())
  const headerSize = 6 + 16
  const buf = new ArrayBuffer(headerSize + pngData.length)
  const view = new DataView(buf)
  view.setUint16(0, 0, true)
  view.setUint16(2, 1, true)
  view.setUint16(4, 1, true)
  view.setUint8(6, canvas.width < 256 ? canvas.width : 0)
  view.setUint8(7, canvas.height < 256 ? canvas.height : 0)
  view.setUint16(10, 1, true)
  view.setUint16(12, 32, true)
  view.setUint32(14, pngData.length, true)
  view.setUint32(18, headerSize, true)
  new Uint8Array(buf).set(pngData, headerSize)
  return new Blob([buf], { type: 'image/x-icon' })
}

export async function processImage(
  file: File,
  options: ProcessingOptions,
  onProgress: (pct: number) => void,
): Promise<ProcessResult> {
  onProgress(10)
  const format = resolveOutputFormat(file, options)

  const bitmap = await decode(file)
  onProgress(35)

  let w = bitmap.width
  let h = bitmap.height
  if (options.width && w > options.width) {
    h = Math.round(h * (options.width / w))
    w = options.width
  }

  const canvas = new OffscreenCanvas(w, h)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('OffscreenCanvas unavailable')
  ctx.drawImage(bitmap, 0, 0, w, h)
  bitmap.close()
  onProgress(65)

  let blob: Blob

  if (format === 'tiff') {
    blob = encodeTiff(getImageData(canvas))
  } else if (format === 'bmp') {
    blob = encodeBmp(getImageData(canvas))
  } else if (format === 'ico') {
    blob = await encodeIco(canvas)
  } else {
    // png / jpg / webp / avif via native Canvas encoder
    const mime = getMimeType(format)
    const quality = isLossless(format) ? undefined : options.quality / 100
    blob = await canvas.convertToBlob({ type: mime, quality })

    // Browsers that can't encode AVIF silently return a PNG — detect & fall back.
    if (format === 'avif' && blob.type !== 'image/avif') {
      blob = await canvas.convertToBlob({ type: 'image/webp', quality })
      onProgress(100)
      return { blob, format: 'webp' }
    }
    if (!blob || blob.size === 0) {
      throw new Error(`encode_failed:${format}`)
    }
  }

  onProgress(100)
  return { blob, format }
}
