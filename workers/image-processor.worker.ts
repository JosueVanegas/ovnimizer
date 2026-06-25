/// <reference lib="webworker" />

import type { ProcessingOptions } from '../types'
import { processImage } from '../lib/codecs/process'

self.onmessage = async (e: MessageEvent) => {
  const { id, file, options } = e.data as {
    id: string
    file: File
    options: ProcessingOptions
  }

  try {
    const { blob, format } = await processImage(file, options, (pct) => {
      self.postMessage({ type: 'PROGRESS', id, value: pct })
    })
    self.postMessage({ type: 'COMPLETE', id, blob, format })
  } catch (err) {
    self.postMessage({ type: 'ERROR', id, error: String(err) })
  }
}
