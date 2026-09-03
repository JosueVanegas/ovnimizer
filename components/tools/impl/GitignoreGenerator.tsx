'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { CopyButton, ToolTextarea } from '../ui'
import { GITIGNORE_LABELS, GITIGNORE_TEMPLATES } from '@/lib/tools/gitignore-templates'

export function GitignoreGenerator() {
  const t = useTranslations('tools.gitignore-generator')
  const [selected, setSelected] = useState<string[]>(['Node', 'Next.js', 'macOS', 'Env'])

  const output = useMemo(
    () =>
      GITIGNORE_LABELS.filter((l) => selected.includes(l))
        .map((l) => GITIGNORE_TEMPLATES[l])
        .join('\n\n'),
    [selected],
  )

  const toggle = (label: string) =>
    setSelected((prev) => (prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]))

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground">{t('includeTemplates')}</label>
        <div className="flex flex-wrap gap-1.5">
          {GITIGNORE_LABELS.map((label) => (
            <button
              key={label}
              onClick={() => toggle(label)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                selected.includes(label)
                  ? 'bg-ufo-green text-black'
                  : 'bg-muted text-muted-foreground hover:bg-muted/70'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-muted-foreground">.gitignore</label>
          <CopyButton value={output} />
        </div>
        <ToolTextarea value={output} readOnly className="min-h-72" placeholder={t('outputPlaceholder')} />
      </div>
    </div>
  )
}
