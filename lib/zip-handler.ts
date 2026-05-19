import JSZip from 'jszip'
import { ImageItem, ImageFormat } from '@/types'
import { getOutputFilename } from './image-processor'

export async function downloadSingleOrZip(images: ImageItem[], format: ImageFormat): Promise<void> {
  const done = images.filter((i) => i.status === 'done' && i.processedBlob)
  if (!done.length) return

  if (done.length === 1) {
    const img = done[0]
    const url = URL.createObjectURL(img.processedBlob!)
    const a = document.createElement('a')
    a.href = url
    a.download = getOutputFilename(img.name, format)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    return
  }

  await downloadZip(done, format)
}

export async function downloadZip(images: ImageItem[], format: ImageFormat): Promise<void> {
  const done = images.filter((i) => i.status === 'done' && i.processedBlob)
  if (!done.length) return

  const zip = new JSZip()
  const folder = zip.folder('ovnimizer')!

  for (const img of done) {
    folder.file(getOutputFilename(img.name, format), img.processedBlob!)
  }

  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 1 },
  })

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ovnimizer-${new Date().toISOString().slice(0, 10)}.zip`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
