'use client'

import { useMemo, useState } from 'react'
import { CopyButton, Toolbar, ToolTextarea } from '../ui'

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => ESCAPES[c])
}

function unescapeHtml(text: string): string {
  // DOMParser decodes all entities safely without executing markup.
  const doc = new DOMParser().parseFromString(text, 'text/html')
  return doc.documentElement.textContent ?? ''
}

function HtmlEscapeTool({ initialMode }: { initialMode: 'escape' | 'unescape' }) {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<'escape' | 'unescape'>(initialMode)

  const output = useMemo(() => {
    if (!input) return ''
    try {
      return mode === 'escape' ? escapeHtml(input) : unescapeHtml(input)
    } catch {
      return ''
    }
  }, [input, mode])

  return (
    <div className="space-y-4">
      <Toolbar>
        <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/40 p-0.5 text-xs">
          {(['escape', 'unescape'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-md px-3 py-1 font-semibold capitalize transition-colors ${
                mode === m ? 'bg-ufo-green text-black' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <button
          onClick={() => setInput(output)}
          disabled={!output}
          className="rounded-lg border border-border/60 bg-muted/40 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-muted/70 disabled:opacity-40"
        >
          Use output as input
        </button>
      </Toolbar>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground">
            {mode === 'escape' ? 'Raw HTML / text' : 'Escaped HTML'}
          </label>
          <ToolTextarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'escape' ? '<div class="x">Hi & bye</div>' : '&lt;div&gt;…&lt;/div&gt;'}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-muted-foreground">Output</label>
            <CopyButton value={output} />
          </div>
          <ToolTextarea value={output} readOnly placeholder="Result…" />
        </div>
      </div>
    </div>
  )
}

export function EscapeHtml() {
  return <HtmlEscapeTool initialMode="escape" />
}

export function UnescapeHtml() {
  return <HtmlEscapeTool initialMode="unescape" />
}
