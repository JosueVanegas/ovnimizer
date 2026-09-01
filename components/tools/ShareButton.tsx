'use client'

import { Share2 } from 'lucide-react'
import { toast } from 'sonner'

export function ShareButton({ title }: { title: string }) {
  async function onShare() {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: `${title} — Ovnimizer`, url })
        return
      } catch {
        /* user cancelled — fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard')
    } catch {
      toast.error('Could not copy link')
    }
  }

  return (
    <button
      type="button"
      onClick={onShare}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/40 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-muted/70"
    >
      <Share2 className="h-3.5 w-3.5" />
      Share
    </button>
  )
}
