'use client'

import { useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { CopyButton, ToolTextarea, Toolbar } from '../ui'

const FREQS = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']

function xmlEscape(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function SitemapGenerator() {
  const t = useTranslations('tools.sitemap-generator')
  const tc = useTranslations('tools.common')
  const [urls, setUrls] = useState('https://example.com/\nhttps://example.com/about\nhttps://example.com/blog')
  const [changefreq, setChangefreq] = useState('weekly')
  const [priority, setPriority] = useState('0.8')
  const [includeLastmod, setIncludeLastmod] = useState(true)

  const output = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    const list = urls.split('\n').map((u) => u.trim()).filter(Boolean)
    const entries = list
      .map((u) => {
        const rows = [`    <loc>${xmlEscape(u)}</loc>`]
        if (includeLastmod) rows.push(`    <lastmod>${today}</lastmod>`)
        rows.push(`    <changefreq>${changefreq}</changefreq>`)
        rows.push(`    <priority>${priority}</priority>`)
        return `  <url>\n${rows.join('\n')}\n  </url>`
      })
      .join('\n')
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`
  }, [urls, changefreq, priority, includeLastmod])

  function download() {
    const blob = new Blob([output], { type: 'application/xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sitemap.xml'
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground">{t('urlsLabel')}</label>
          <ToolTextarea value={urls} onChange={(e) => setUrls(e.target.value)} className="min-h-72" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-muted-foreground">sitemap.xml</label>
            <div className="flex items-center gap-2">
              <CopyButton value={output} />
              <button
                onClick={download}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/40 px-3 py-1.5 text-xs font-semibold hover:bg-muted/70"
              >
                <Download className="h-3.5 w-3.5" /> {tc('download')}
              </button>
            </div>
          </div>
          <pre className="overflow-x-auto rounded-xl border border-border/50 bg-muted/20 p-3 font-mono text-xs min-h-72">{output}</pre>
        </div>
      </div>

      <Toolbar>
        <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          {t('changeFrequency')}
          <select
            value={changefreq}
            onChange={(e) => setChangefreq(e.target.value)}
            className="rounded-lg border border-border/60 bg-muted/40 px-2 py-1 text-xs"
          >
            {FREQS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          {t('priority')}
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="rounded-lg border border-border/60 bg-muted/40 px-2 py-1 text-xs"
          >
            {['1.0', '0.9', '0.8', '0.7', '0.6', '0.5', '0.4', '0.3'].map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <input type="checkbox" checked={includeLastmod} onChange={(e) => setIncludeLastmod(e.target.checked)} className="accent-[var(--ufo-green)]" />
          {t('includeLastmod')}
        </label>
      </Toolbar>
    </div>
  )
}
