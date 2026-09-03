'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { CopyButton, ToolInput } from '../ui'

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export function MetadataGenerator() {
  const t = useTranslations('tools.metadata-generator')
  const [f, setF] = useState({
    title: 'My Awesome Page',
    description: 'A short, compelling description of the page.',
    url: 'https://example.com',
    image: 'https://example.com/og.png',
    site: 'Example',
    twitter: '@example',
    type: 'website',
  })

  const set = (k: keyof typeof f, v: string) => setF((prev) => ({ ...prev, [k]: v }))

  const output = useMemo(() => {
    const lines: (string | null)[] = [
      `<title>${esc(f.title)}</title>`,
      `<meta name="description" content="${esc(f.description)}" />`,
      f.url ? `<link rel="canonical" href="${esc(f.url)}" />` : null,
      '',
      `<meta property="og:type" content="${esc(f.type)}" />`,
      `<meta property="og:title" content="${esc(f.title)}" />`,
      `<meta property="og:description" content="${esc(f.description)}" />`,
      f.url ? `<meta property="og:url" content="${esc(f.url)}" />` : null,
      f.site ? `<meta property="og:site_name" content="${esc(f.site)}" />` : null,
      f.image ? `<meta property="og:image" content="${esc(f.image)}" />` : null,
      '',
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${esc(f.title)}" />`,
      `<meta name="twitter:description" content="${esc(f.description)}" />`,
      f.image ? `<meta name="twitter:image" content="${esc(f.image)}" />` : null,
      f.twitter ? `<meta name="twitter:site" content="${esc(f.twitter)}" />` : null,
    ]
    return lines.filter((l): l is string => l !== null).join('\n')
  }, [f])

  const FIELDS: { key: keyof typeof f; label: string }[] = [
    { key: 'title', label: t('title') },
    { key: 'description', label: t('description') },
    { key: 'url', label: t('canonicalUrl') },
    { key: 'image', label: t('imageUrl') },
    { key: 'site', label: t('siteName') },
    { key: 'twitter', label: t('twitterHandle') },
    { key: 'type', label: t('ogType') },
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-3">
        {FIELDS.map((field) => (
          <div key={field.key} className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">{field.label}</label>
            <ToolInput value={f[field.key]} onChange={(e) => set(field.key, e.target.value)} />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-muted-foreground">{t('htmlMetaTags')}</label>
          <CopyButton value={output} />
        </div>
        <pre className="h-full overflow-x-auto rounded-xl border border-border/50 bg-muted/20 p-3 font-mono text-xs">{output}</pre>
      </div>
    </div>
  )
}
