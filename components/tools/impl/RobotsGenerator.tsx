'use client'

import { useMemo, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { CopyButton, ToolInput, Toolbar } from '../ui'

export function RobotsGenerator() {
  const [preset, setPreset] = useState<'all' | 'none' | 'custom'>('all')
  const [userAgent, setUserAgent] = useState('*')
  const [disallow, setDisallow] = useState<string[]>(['/admin', '/private'])
  const [sitemap, setSitemap] = useState('https://example.com/sitemap.xml')

  const output = useMemo(() => {
    const lines = [`User-agent: ${userAgent || '*'}`]
    if (preset === 'all') lines.push('Allow: /')
    else if (preset === 'none') lines.push('Disallow: /')
    else {
      const paths = disallow.filter((p) => p.trim())
      if (paths.length) paths.forEach((p) => lines.push(`Disallow: ${p}`))
      else lines.push('Disallow:')
    }
    if (sitemap.trim()) {
      lines.push('')
      lines.push(`Sitemap: ${sitemap.trim()}`)
    }
    return lines.join('\n')
  }, [preset, userAgent, disallow, sitemap])

  return (
    <div className="space-y-4">
      <Toolbar>
        <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/40 p-0.5 text-xs">
          {(['all', 'none', 'custom'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPreset(p)}
              className={`rounded-md px-3 py-1 font-semibold transition-colors ${
                preset === p ? 'bg-ufo-green text-black' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {p === 'all' ? 'Allow all' : p === 'none' ? 'Block all' : 'Custom'}
            </button>
          ))}
        </div>
      </Toolbar>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">User-agent</label>
          <ToolInput value={userAgent} onChange={(e) => setUserAgent(e.target.value)} placeholder="*" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">Sitemap URL</label>
          <ToolInput value={sitemap} onChange={(e) => setSitemap(e.target.value)} placeholder="https://…/sitemap.xml" />
        </div>
      </div>

      {preset === 'custom' && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground">Disallow paths</label>
          {disallow.map((p, i) => (
            <div key={i} className="flex items-center gap-2">
              <ToolInput
                value={p}
                onChange={(e) => setDisallow((prev) => prev.map((x, j) => (j === i ? e.target.value : x)))}
                placeholder="/path"
              />
              <button
                onClick={() => setDisallow((prev) => prev.filter((_, j) => j !== i))}
                className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                aria-label="Remove path"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => setDisallow((prev) => [...prev, ''])}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/40 px-3 py-1.5 text-xs font-semibold hover:bg-muted/70"
          >
            <Plus className="h-3.5 w-3.5" /> Add path
          </button>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-muted-foreground">robots.txt</label>
          <CopyButton value={output} />
        </div>
        <pre className="overflow-x-auto rounded-xl border border-border/50 bg-muted/20 p-3 font-mono text-sm">{output}</pre>
      </div>
    </div>
  )
}
