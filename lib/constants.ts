import type { ProcessingOptions } from '@/types'

export const FORMATS = ['png', 'jpg', 'webp', 'avif', 'ico'] as const

export const DEFAULT_OPTIONS: ProcessingOptions = {
  format: 'webp',
  quality: 80,
  width: null,
}

export const MAX_FILE_SIZE = 50 * 1024 * 1024
export const MAX_TOTAL_SIZE = 100 * 1024 * 1024
export const MAX_FILES = 50

export const ACCEPTED_TYPES = {
  'image/jpeg':   ['.jpg', '.jpeg', '.jfif'],
  'image/png':    ['.png'],
  'image/webp':   ['.webp'],
  'image/avif':   ['.avif'],
  'image/gif':    ['.gif'],
  'image/bmp':    ['.bmp'],
  'image/svg+xml':['.svg'],
  'image/heic':   ['.heic'],
  'image/heif':   ['.heif'],
}

export const QUALITY_PRESETS = [
  { key: 'max',        value: 100 },
  { key: 'high',       value: 90  },
  { key: 'balanced',   value: 80  },
  { key: 'aggressive', value: 60  },
  { key: 'minimum',    value: 40  },
] as const

export const RESIZE_PRESETS = [
  { key: 'original', value: null },
  { key: 'large',    value: 2560 },
  { key: 'medium',   value: 1920 },
  { key: 'small',    value: 1280 },
  { key: 'thumb',    value: 800  },
] as const
