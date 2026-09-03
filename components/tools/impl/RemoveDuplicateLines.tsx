'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { CopyButton, Toolbar, ToolTextarea } from '../ui'

export function RemoveDuplicateLines() {
  const t = useTranslations('tools.remove-duplicate-lines')
  const tc = useTranslations('tools.common')
  const [input, setInput] = useState('')
  const [caseInsensitive, setCaseInsensitive] = useState(false)
  const [trim, setTrim] = useState(true)

  const { output, removed } = useMemo(() => {
    const lines = input.split('\n')
    const seen = new Set<string>()
    const result: string[] = []
    for (const line of lines) {
      const candidate = trim ? line.trim() : line
      const key = caseInsensitive ? candidate.toLowerCase() : candidate
      if (seen.has(key)) continue
      seen.add(key)
      result.push(trim ? candidate : line)
    }
    return { output: result.join('\n'), removed: lines.length - result.length }
  }, [input, caseInsensitive, trim])

  return (
    <div className="space-y-4">
      <Toolbar>
        <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <input type="checkbox" checked={caseInsensitive} onChange={(e) => setCaseInsensitive(e.target.checked)} className="accent-[var(--ufo-green)]" />
          {tc('caseInsensitive')}
        </label>
        <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <input type="checkbox" checked={trim} onChange={(e) => setTrim(e.target.checked)} className="accent-[var(--ufo-green)]" />
          {tc('trimWhitespace')}
        </label>
        {input.trim() && (
          <span className="text-xs text-muted-foreground">
            {removed > 0 ? t('removed', { n: removed }) : t('noDuplicates')}
          </span>
        )}
      </Toolbar>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground">{tc('input')}</label>
          <ToolTextarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('inputPlaceholder')} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-muted-foreground">{t('uniqueLines')}</label>
            <CopyButton value={output} />
          </div>
          <ToolTextarea value={output} readOnly placeholder={tc('result')} />
        </div>
      </div>
    </div>
  )
}
