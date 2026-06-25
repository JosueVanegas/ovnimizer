// Concrete formats Ovnimizer can *output* (encode) client-side
export type OutputFormat = 'png' | 'jpg' | 'webp' | 'avif' | 'tiff' | 'bmp' | 'ico'

// In Optimize mode the user may keep the source format ('keep').
// In Convert mode a concrete OutputFormat is always required.
export type FormatChoice = OutputFormat | 'keep'

export type ToolMode = 'optimize' | 'convert'

export type ImageStatus = 'idle' | 'processing' | 'done' | 'error'

export interface ImageItem {
  id: string
  file: File
  name: string
  originalSize: number
  preview: string
  width: number
  height: number
  status: ImageStatus
  settings: ProcessingOptions
  processedBlob?: Blob
  processedPreview?: string
  processedSize?: number
  /** Concrete format the blob was encoded as (resolves 'keep'). */
  outputFormat?: OutputFormat
  errorMessage?: string
}

export interface ProcessingOptions {
  mode: ToolMode
  /** 'keep' only valid in optimize mode. */
  format: FormatChoice
  quality: number
  width: number | null
}
