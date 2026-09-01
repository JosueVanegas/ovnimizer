'use client'

import { useState, useCallback, useRef, TextareaHTMLAttributes, InputHTMLAttributes } from 'react'
import { Check, Copy, ShieldCheck, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function LocalBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-ufo-green/10 px-2.5 py-1 text-xs font-medium text-ufo-green',
        className,
      )}
    >
      <ShieldCheck className="h-3.5 w-3.5" />
      Processed locally in your browser
    </span>
  )
}

export function useCopy() {
  const [copied, setCopied] = useState(false)
  const copy = useCallback(async (text: string, label = 'Copied to clipboard') => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success(label)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error('Could not copy')
    }
  }, [])
  return { copied, copy }
}

export function CopyButton({
  value,
  label,
  className,
  disabled,
}: {
  value: string
  label?: string
  className?: string
  disabled?: boolean
}) {
  const { copied, copy } = useCopy()
  return (
    <button
      type="button"
      onClick={() => copy(value)}
      disabled={disabled || !value}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/40 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-muted/70 disabled:opacity-40 disabled:cursor-not-allowed',
        className,
      )}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-ufo-green" /> : <Copy className="h-3.5 w-3.5" />}
      {label ?? (copied ? 'Copied' : 'Copy')}
    </button>
  )
}

export function ToolTextarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      spellCheck={false}
      className={cn(
        'w-full min-h-52 rounded-xl border border-border/60 bg-muted/30 p-3 font-mono text-sm outline-none transition-colors focus:border-ufo-green/60 placeholder:text-muted-foreground/50 resize-y',
        className,
      )}
      {...props}
    />
  )
}

export function ToolInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full rounded-xl border border-border/60 bg-muted/30 px-3 py-2 text-sm outline-none transition-colors focus:border-ufo-green/60 placeholder:text-muted-foreground/50',
        className,
      )}
      {...props}
    />
  )
}

export function Toolbar({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-2">{children}</div>
}

export function FileDrop({
  onFile,
  accept,
  hint = 'Drop a file here or click to browse',
}: {
  onFile: (file: File) => void
  accept?: string
  hint?: string
}) {
  const [drag, setDrag] = useState(false)
  const ref = useRef<HTMLInputElement>(null)

  return (
    <div
      onClick={() => ref.current?.click()}
      onDragOver={(e) => {
        e.preventDefault()
        setDrag(true)
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDrag(false)
        const f = e.dataTransfer.files?.[0]
        if (f) onFile(f)
      }}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-8 text-center transition-colors',
        drag ? 'border-ufo-green bg-ufo-green/5' : 'border-border/60 hover:border-ufo-green/50 hover:bg-muted/40',
      )}
    >
      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onFile(f)
          e.target.value = ''
        }}
      />
      <Upload className="h-7 w-7 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{hint}</p>
    </div>
  )
}
