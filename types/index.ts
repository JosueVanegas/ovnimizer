export type ImageFormat = 'png' | 'jpg' | 'webp' | 'avif' | 'ico'
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
  errorMessage?: string
}

export interface ProcessingOptions {
  format: ImageFormat
  quality: number
  width: number | null
}
