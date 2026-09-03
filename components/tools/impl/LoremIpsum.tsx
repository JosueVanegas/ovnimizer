'use client'

import { useCallback, useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { CopyButton, ToolInput, ToolTextarea, Toolbar } from '../ui'

const WORDS =
  'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(
    ' ',
  )

const rand = (n: number) => Math.floor(Math.random() * n)

function sentence(): string {
  const len = 8 + rand(8)
  const words = Array.from({ length: len }, () => WORDS[rand(WORDS.length)])
  const s = words.join(' ')
  return s.charAt(0).toUpperCase() + s.slice(1) + '.'
}

function paragraph(): string {
  const len = 3 + rand(4)
  return Array.from({ length: len }, sentence).join(' ')
}

type Unit = 'paragraphs' | 'sentences' | 'words'

export function LoremIpsum() {
  const t = useTranslations('tools.lorem-ipsum')
  const tc = useTranslations('tools.common')
  const [count, setCount] = useState(3)
  const [unit, setUnit] = useState<Unit>('paragraphs')
  const [startClassic, setStartClassic] = useState(true)
  const [output, setOutput] = useState('')

  const generate = useCallback(() => {
    const n = Math.min(Math.max(count, 1), 100)
    let text: string
    if (unit === 'paragraphs') text = Array.from({ length: n }, paragraph).join('\n\n')
    else if (unit === 'sentences') text = Array.from({ length: n }, sentence).join(' ')
    else text = Array.from({ length: n }, () => WORDS[rand(WORDS.length)]).join(' ')

    if (startClassic && !text.startsWith('Lorem ipsum')) {
      text = 'Lorem ipsum dolor sit amet, ' + text.charAt(0).toLowerCase() + text.slice(1)
    }
    setOutput(text)
  }, [count, unit, startClassic])

  useEffect(() => {
    generate()
  }, [generate])

  return (
    <div className="space-y-4">
      <Toolbar>
        <ToolInput
          type="number"
          min={1}
          max={100}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="w-20"
        />
        <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/40 p-0.5 text-xs">
          {(['paragraphs', 'sentences', 'words'] as const).map((u) => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              className={`rounded-md px-2.5 py-1 font-semibold transition-colors ${
                unit === u ? 'bg-ufo-green text-black' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {t(u)}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <input
            type="checkbox"
            checked={startClassic}
            onChange={(e) => setStartClassic(e.target.checked)}
            className="accent-[var(--ufo-green)]"
          />
          {t('startClassic')}
        </label>
        <button
          onClick={generate}
          className="inline-flex items-center gap-1.5 rounded-lg bg-ufo-green px-3 py-1.5 text-xs font-bold text-black transition-colors hover:bg-ufo-green/85"
        >
          <RefreshCw className="h-3.5 w-3.5" /> {tc('generate')}
        </button>
        <CopyButton value={output} />
      </Toolbar>

      <ToolTextarea value={output} readOnly className="min-h-64" />
    </div>
  )
}
