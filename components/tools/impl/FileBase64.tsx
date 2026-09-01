'use client'

import { useState } from 'react'
import { Download, FileIcon } from 'lucide-react'
import { CopyButton, FileDrop, ToolInput, ToolTextarea, Toolbar } from '../ui'
import { formatBytes } from '@/lib/utils'

export function FileBase64() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')

  const [dataUri, setDataUri] = useState('')
  const [meta, setMeta] = useState<{ name: string; size: number; type: string } | null>(null)

  const [input, setInput] = useState('')
  const [filename, setFilename] = useState('download.bin')

  function onFile(file: File) {
    const reader = new FileReader()
    reader.onload = () => {
      setDataUri(String(reader.result))
      setMeta({ name: file.name, size: file.size, type: file.type || 'application/octet-stream' })
    }
    reader.readAsDataURL(file)
  }

  function download() {
    const value = input.trim()
    if (!value) return
    const href = value.startsWith('data:') ? value : `data:application/octet-stream;base64,${value}`
    const a = document.createElement('a')
    a.href = href
    a.download = filename || 'download.bin'
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
              {m === 'encode' ? 'File → Base64' : 'Base64 → File'}
            </button>
          ))}
        </div>
      </Toolbar>

      {mode === 'encode' ? (
        <>
          <FileDrop onFile={onFile} hint="Drop any file here or click to browse" />
          {dataUri && meta && (
            <>
              <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/20 p-3">
                <FileIcon className="h-8 w-8 shrink-0 text-ufo-green" />
                <div className="min-w-0 text-xs text-muted-foreground">
                  <p className="truncate font-medium text-foreground">{meta.name}</p>
                  <p>{meta.type} · {formatBytes(meta.size)} · {formatBytes(dataUri.length)} as Base64</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-muted-foreground">Data URI</label>
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
            <label className="text-xs font-semibold text-muted-foreground">Base64 or data URI</label>
            <ToolTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="data:application/pdf;base64,JVBERi0…"
              className="min-h-40"
            />
          </div>
          <div className="flex items-end gap-2">
            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Filename</label>
              <ToolInput value={filename} onChange={(e) => setFilename(e.target.value)} placeholder="download.bin" />
            </div>
            <button
              onClick={download}
              disabled={!input.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-ufo-green px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-ufo-green/85 disabled:opacity-40"
            >
              <Download className="h-4 w-4" /> Download
            </button>
          </div>
        </>
      )}
    </div>
  )
}
