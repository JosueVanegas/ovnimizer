'use client'

import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import jsQR from 'jsqr'
import { CopyButton, FileDrop } from '../ui'

export function QrReader() {
  const [result, setResult] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function onFile(file: File) {
    setError(null)
    setResult(null)
    const url = URL.createObjectURL(file)
    setPreview(url)
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        setError('Could not read the image.')
        return
      }
      ctx.drawImage(img, 0, 0)
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(data.data, data.width, data.height)
      if (code) setResult(code.data)
      else setError('No QR code found in this image.')
    }
    img.onerror = () => setError('Could not load the image.')
    img.src = url
  }

  const isUrl = result ? /^https?:\/\//i.test(result) : false

  return (
    <div className="space-y-4">
      <FileDrop onFile={onFile} accept="image/*" hint="Drop a QR code image here or click to browse" />

      {preview && (
        <div className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="uploaded" className="max-h-40 rounded-lg border border-border/50 object-contain" />
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-muted-foreground">Decoded content</label>
            <div className="flex items-center gap-2">
              {isUrl && (
                <a
                  href={result}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/40 px-3 py-1.5 text-xs font-semibold hover:bg-muted/70"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Open
                </a>
              )}
              <CopyButton value={result} />
            </div>
          </div>
          <pre className="whitespace-pre-wrap break-all rounded-xl border border-border/50 bg-muted/20 p-3 font-mono text-sm">{result}</pre>
        </div>
      )}
      <p className="text-xs text-muted-foreground">Decoded locally — images never leave your browser.</p>
    </div>
  )
}
