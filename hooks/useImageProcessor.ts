'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ImageItem, ProcessingOptions } from '@/types'

async function decodeIfHeic(file: File): Promise<File> {
  if (file.type !== 'image/heic' && file.type !== 'image/heif') return file
  const { default: heic2any } = await import('heic2any')
  const result = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.9 })
  const blob = Array.isArray(result) ? result[0] : result
  const name = file.name.replace(/\.hei[cf]$/i, '.jpg')
  return new File([blob], name, { type: 'image/jpeg' })
}

interface Progress {
  total: number
  done: number
  imagePct: number
  startedAt: number | null
}

const IDLE: Progress = { total: 0, done: 0, imagePct: 0, startedAt: null }

export function useImageProcessor(
  onUpdate: (id: string, updates: Partial<ImageItem>) => void
) {
  const workerRef = useRef<Worker | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState<Progress>(IDLE)

  const pendingRef = useRef<Array<{ item: ImageItem; options: ProcessingOptions }>>([])
  const canceledRef = useRef(false)
  const onUpdateRef = useRef(onUpdate)
  onUpdateRef.current = onUpdate

  const nextRef = useRef<() => void>(() => {})

  useEffect(() => {
    const w = new Worker(
      new URL('../workers/image-processor.worker', import.meta.url)
    )
    workerRef.current = w

    w.onmessage = (e) => {
      const { type, id, value, blob, error } = e.data

      if (type === 'PROGRESS') {
        setProgress((p) => ({ ...p, imagePct: value }))
      } else if (type === 'COMPLETE') {
        const preview = URL.createObjectURL(blob)
        onUpdateRef.current(id, {
          status: 'done',
          processedBlob: blob,
          processedPreview: preview,
          processedSize: blob.size,
        })
        setProgress((p) => ({ ...p, done: p.done + 1, imagePct: 100 }))
        nextRef.current()
      } else if (type === 'ERROR') {
        onUpdateRef.current(id, { status: 'error', errorMessage: error })
        setProgress((p) => ({ ...p, done: p.done + 1, imagePct: 0 }))
        nextRef.current()
      }
    }

    return () => w.terminate()
  }, [])

  nextRef.current = () => {
    if (canceledRef.current || !pendingRef.current.length) {
      setIsProcessing(false)
      return
    }
    const { item, options } = pendingRef.current.shift()!
    setProgress((p) => ({ ...p, imagePct: 0 }))
    workerRef.current?.postMessage({ id: item.id, file: item.file, options })
  }

  const processImages = useCallback(async (tasks: Array<{ item: ImageItem; options: ProcessingOptions }>) => {
    if (!tasks.length) return
    canceledRef.current = false

    // Decode HEIC/HEIF on the main thread — heic2any needs document/window
    const decoded = await Promise.all(
      tasks.map(async ({ item, options }) => ({
        item: { ...item, file: await decodeIfHeic(item.file) },
        options,
      }))
    )

    pendingRef.current = decoded

    decoded.forEach(({ item }) =>
      onUpdateRef.current(item.id, {
        status: 'processing',
        processedBlob: undefined,
        processedPreview: undefined,
        processedSize: undefined,
        errorMessage: undefined,
      })
    )

    setIsProcessing(true)
    setProgress({ total: decoded.length, done: 0, imagePct: 0, startedAt: Date.now() })

    const { item, options } = pendingRef.current.shift()!
    workerRef.current?.postMessage({ id: item.id, file: item.file, options })
  }, [])

  const cancel = useCallback(() => {
    canceledRef.current = true
    pendingRef.current = []
    setIsProcessing(false)
    setProgress(IDLE)
  }, [])

  return { isProcessing, progress, processImages, cancel }
}
