'use client'

import { useEffect, useState, useCallback } from 'react'
import { Download } from 'lucide-react'
import { useTranslations } from 'next-intl'
import QRCode from 'qrcode'
import { ToolInput, ToolTextarea, Toolbar } from '../ui'

type Level = 'L' | 'M' | 'Q' | 'H'

export function QrGenerator() {
  const t = useTranslations('qr')
  const [text, setText] = useState('https://ovnimizer.com')
  const [size, setSize] = useState(320)
  const [level, setLevel] = useState<Level>('M')
  const [dataUrl, setDataUrl] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    if (!text) {
      setDataUrl('')
      return
    }
    QRCode.toDataURL(text, {
      width: size,
      margin: 2,
      errorCorrectionLevel: level,
      color: { dark: '#000000ff', light: '#ffffffff' },
    })
      .then((url) => {
        if (!cancelled) {
          setDataUrl(url)
          setError(null)
        }
      })
      .catch(() => {
        if (!cancelled) setError(t('tooLong'))
      })
    return () => {
      cancelled = true
    }
  }, [text, size, level, t])

  const download = useCallback(() => {
    if (!dataUrl) return
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = 'qrcode.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [dataUrl])

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground">{t('textLabel')}</label>
          <ToolTextarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('placeholder')}
            className="min-h-28"
          />
        </div>

        <Toolbar>
          <label className="text-xs font-semibold text-muted-foreground">{t('size')}</label>
          <ToolInput
            type="number"
            min={128}
            max={1024}
            step={32}
            value={size}
            onChange={(e) => setSize(Math.min(Math.max(Number(e.target.value), 128), 1024))}
            className="w-24"
          />
          <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/40 p-0.5 text-xs">
            {(['L', 'M', 'Q', 'H'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                title={`Error correction ${l}`}
                className={`rounded-md px-2.5 py-1 font-mono font-semibold transition-colors ${
                  level === l ? 'bg-ufo-green text-black' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </Toolbar>
        <p className="text-xs text-muted-foreground">
          {t('errorLevel')}
        </p>
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="flex aspect-square w-full items-center justify-center rounded-2xl border border-border/50 bg-white p-4">
          {error ? (
            <p className="px-4 text-center text-sm text-destructive">{error}</p>
          ) : dataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={dataUrl} alt="QR code" className="h-full w-full object-contain" />
          ) : (
            <span className="text-sm text-muted-foreground">{t('enterText')}</span>
          )}
        </div>
        <button
          onClick={download}
          disabled={!dataUrl}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-ufo-green px-3 py-2 text-sm font-bold text-black transition-colors hover:bg-ufo-green/85 disabled:opacity-40"
        >
          <Download className="h-4 w-4" /> {t('downloadPng')}
        </button>
      </div>
    </div>
  )
}
