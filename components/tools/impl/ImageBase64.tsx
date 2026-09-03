'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { CopyButton, FileDrop, ToolTextarea, Toolbar } from '../ui'
import { formatBytes } from '@/lib/utils'

export function ImageBase64() {
  const t = useTranslations('tools.base64-image')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')

  // encode
  const [dataUri, setDataUri] = useState('')
  const [meta, setMeta] = useState<{ name: string; size: number } | null>(null)

  // decode
  const [input, setInput] = useState('')
  const src = input.trim().startsWith('data:')
    ? input.trim()
    : input.trim()
      ? `data:image/png;base64,${input.trim()}`
      : ''

  function onFile(file: File) {
    const reader = new FileReader()
    reader.onload = () => {
      setDataUri(String(reader.result))
      setMeta({ name: file.name, size: file.size })
    }
    reader.readAsDataURL(file)
  }

  function download() {
    if (!src) return
    const a = document.createElement('a')
    a.href = src
    a.download = 'image'
    a.click()
  }

  return (
    <div className="space-y-4">
      <Toolbar>
        <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/40 p-0.5 text-xs">
          {(['encode', 'decode'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-md px-3 py-1 font-semibold transition-colors ${
                mode === m ? 'bg-ufo-green text-black' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {m === 'encode' ? t('toBase64') : t('toImage')}
            </button>
          ))}
        </div>
      </Toolbar>

      {mode === 'encode' ? (
        <>
          <FileDrop onFile={onFile} accept="image/*" hint={t('dropImage')} />
          {dataUri && (
            <>
              <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-muted/20 p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={dataUri} alt="preview" className="h-16 w-16 rounded-lg object-contain" />
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium text-foreground">{meta?.name}</p>
                  <p>{meta && formatBytes(meta.size)} · {t('asBase64', { size: formatBytes(dataUri.length) })}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-muted-foreground">{t('dataUri')}</label>
                  <CopyButton value={dataUri} />
                </div>
                <ToolTextarea value={dataUri} readOnly className="min-h-40" />
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">{t('inputLabel')}</label>
            <ToolTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="data:image/png;base64,iVBORw0KGgo…"
              className="min-h-40"
            />
          </div>
          {src && (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-border/50 bg-muted/20 p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="decoded" className="max-h-64 max-w-full rounded-lg object-contain" />
              <button
                onClick={download}
                className="inline-flex items-center gap-1.5 rounded-lg bg-ufo-green px-3 py-2 text-sm font-bold text-black transition-colors hover:bg-ufo-green/85"
              >
                <Download className="h-4 w-4" /> {t('downloadImage')}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
