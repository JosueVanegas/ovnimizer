'use client'

import { useMemo, useState } from 'react'
import { CopyButton, ToolInput, ToolTextarea } from '../ui'

const TYPES = [
  { key: 'feat', desc: 'A new feature' },
  { key: 'fix', desc: 'A bug fix' },
  { key: 'docs', desc: 'Documentation only' },
  { key: 'style', desc: 'Formatting, no code change' },
  { key: 'refactor', desc: 'Neither fixes a bug nor adds a feature' },
  { key: 'perf', desc: 'Improves performance' },
  { key: 'test', desc: 'Adding or fixing tests' },
  { key: 'build', desc: 'Build system or dependencies' },
  { key: 'ci', desc: 'CI configuration' },
  { key: 'chore', desc: 'Other changes' },
  { key: 'revert', desc: 'Reverts a previous commit' },
]

export function ConventionalCommit() {
  const [type, setType] = useState('feat')
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
        <label className="text-xs font-semibold text-muted-foreground">Type</label>
        <div className="flex flex-wrap gap-1.5">
          {TYPES.map((t) => (
            <button
              key={t.key}
              onClick={() => setType(t.key)}
              title={t.desc}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                type === t.key ? 'bg-ufo-green text-black' : 'bg-muted text-muted-foreground hover:bg-muted/70'
              }`}
            >
              {t.key}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-[200px_1fr]">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">Scope (optional)</label>
          <ToolInput value={scope} onChange={(e) => setScope(e.target.value)} placeholder="api, ui, auth…" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">Description</label>
          <ToolInput value={description} onChange={(e) => setDescription(e.target.value)} placeholder="add login endpoint" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground">Body (optional)</label>
        <ToolTextarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Longer explanation…" className="min-h-24" />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <input type="checkbox" checked={breaking} onChange={(e) => setBreaking(e.target.checked)} className="accent-[var(--ufo-green)]" />
          Breaking change
        </label>
        {breaking && (
          <ToolInput value={breakingDesc} onChange={(e) => setBreakingDesc(e.target.value)} placeholder="Describe what breaks…" />
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-muted-foreground">Commit message</label>
          <CopyButton value={message} />
        </div>
        <pre className="overflow-x-auto rounded-xl border border-border/50 bg-muted/20 p-3 font-mono text-sm">{message}</pre>
      </div>
    </div>
  )
}
