import JSZip from 'jszip'
import { ImageItem } from '@/types'
import { getOutputFilename } from './formats'

function filenameFor(img: ImageItem): string {
  return getOutputFilename(img.name, img.outputFormat ?? 'webp')
}

export async function downloadSingleOrZip(images: ImageItem[]): Promise<void> {
  const done = images.filter((i) => i.status === 'done' && i.processedBlob)
  if (!done.length) return

  if (done.length === 1) {
    triggerDownload(done[0].processedBlob!, filenameFor(done[0]))
    return
  }

  await downloadZip(done)
}

export async function downloadZip(images: ImageItem[]): Promise<void> {
  const done = images.filter((i) => i.status === 'done' && i.processedBlob)
  if (!done.length) return

  const zip = new JSZip()
  const folder = zip.folder('ovnimizer')!

  for (const img of done) {
    folder.file(filenameFor(img), img.processedBlob!)
  }

  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 1 },
  })

  triggerDownload(blob, `ovnimizer-${new Date().toISOString().slice(0, 10)}.zip`)
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
