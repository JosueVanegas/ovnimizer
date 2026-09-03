'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { CopyButton, ToolInput, ToolTextarea } from '../ui'

const TYPES = ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert'] as const

export function ConventionalCommit() {
  const t = useTranslations('tools.conventional-commit')
  const [type, setType] = useState<string>('feat')
  const [scope, setScope] = useState('')
  const [description, setDescription] = useState('')
  const [body, setBody] = useState('')
  const [breaking, setBreaking] = useState(false)
  const [breakingDesc, setBreakingDesc] = useState('')

  const message = useMemo(() => {
    const header = `${type}${scope ? `(${scope})` : ''}${breaking ? '!' : ''}: ${description || 'summary'}`
    const parts = [header]
    if (body.trim()) parts.push('', body.trim())
    if (breaking && breakingDesc.trim()) parts.push('', `BREAKING CHANGE: ${breakingDesc.trim()}`)
    return parts.join('\n')
  }, [type, scope, description, body, breaking, breakingDesc])

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground">{t('type')}</label>
        <div className="flex flex-wrap gap-1.5">
          {TYPES.map((key) => (
            <button
              key={key}
              onClick={() => setType(key)}
              title={t(key)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                type === key ? 'bg-ufo-green text-black' : 'bg-muted text-muted-foreground hover:bg-muted/70'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-[200px_1fr]">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">{t('scope')}</label>
          <ToolInput value={scope} onChange={(e) => setScope(e.target.value)} placeholder={t('scopePlaceholder')} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">{t('description')}</label>
          <ToolInput value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('descriptionPlaceholder')} />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground">{t('body')}</label>
        <ToolTextarea value={body} onChange={(e) => setBody(e.target.value)} placeholder={t('bodyPlaceholder')} className="min-h-24" />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <input type="checkbox" checked={breaking} onChange={(e) => setBreaking(e.target.checked)} className="accent-[var(--ufo-green)]" />
          {t('breaking')}
        </label>
        {breaking && (
          <ToolInput value={breakingDesc} onChange={(e) => setBreakingDesc(e.target.value)} placeholder={t('breakingPlaceholder')} />
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-muted-foreground">{t('commitMessage')}</label>
          <CopyButton value={message} />
        </div>
        <pre className="overflow-x-auto rounded-xl border border-border/50 bg-muted/20 p-3 font-mono text-sm">{message}</pre>
      </div>
    </div>
  )
}
