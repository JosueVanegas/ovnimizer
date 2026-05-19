'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { ImageItem } from '@/types'
import { MAX_FILE_SIZE, MAX_TOTAL_SIZE, MAX_FILES, DEFAULT_OPTIONS } from '@/lib/constants'

export function useFileUpload() {
  const [images, setImages] = useState<ImageItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const imagesRef = useRef<ImageItem[]>([])

  useEffect(() => {
    imagesRef.current = images
  }, [images])

  const addImages = useCallback((files: File[]) => {
    setError(null)
    const prev = imagesRef.current

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        setError(`"${file.name}" exceeds the 50MB per-file limit`)
        return
      }
    }

    const currentTotal = prev.reduce((sum, img) => sum + img.originalSize, 0)
    const newTotal = files.reduce((sum, f) => sum + f.size, 0)

    if (currentTotal + newTotal > MAX_TOTAL_SIZE) {
      setError('Session limit of 100MB reached. Remove some images first.')
      return
    }

    if (prev.length + files.length > MAX_FILES) {
      setError(`Maximum ${MAX_FILES} images at once.`)
      return
    }

    const entries: ImageItem[] = files.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      name: file.name,
      originalSize: file.size,
      preview: URL.createObjectURL(file),
      width: 0,
      height: 0,
      status: 'idle',
      settings: { ...DEFAULT_OPTIONS },
    }))

    entries.forEach((entry) => {
      const img = new window.Image()
      img.onload = () => {
        setImages((curr) =>
          curr.map((i) =>
            i.id === entry.id ? { ...i, width: img.naturalWidth, height: img.naturalHeight } : i
          )
        )
      }
      img.src = entry.preview
    })

    setImages((curr) => [...curr, ...entries])
  }, [])

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const target = prev.find((i) => i.id === id)
      if (target) {
        URL.revokeObjectURL(target.preview)
        if (target.processedPreview) URL.revokeObjectURL(target.processedPreview)
      }
      return prev.filter((i) => i.id !== id)
    })
  }, [])

  const updateItem = useCallback((id: string, updates: Partial<ImageItem>) => {
    setImages((prev) => prev.map((img) => (img.id === id ? { ...img, ...updates } : img)))
  }, [])

  const clearAll = useCallback(() => {
    setImages((prev) => {
      prev.forEach((i) => {
        URL.revokeObjectURL(i.preview)
        if (i.processedPreview) URL.revokeObjectURL(i.processedPreview)
      })
      return []
    })
  }, [])

  const resetProcessed = useCallback(() => {
    setImages((prev) =>
      prev.map((i) => {
        if (i.processedPreview) URL.revokeObjectURL(i.processedPreview)
        return { ...i, status: 'idle' as const, processedBlob: undefined, processedPreview: undefined, processedSize: undefined, errorMessage: undefined }
      })
    )
  }, [])

  return { images, error, addImages, removeImage, updateItem, clearAll, resetProcessed }
}
