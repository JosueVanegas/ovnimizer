import type { LucideIcon } from 'lucide-react'

export type ToolCategoryId =
  | 'images'
  | 'json'
  | 'base64'
  | 'jwt'
  | 'hash'
  | 'uuid'
  | 'text'
  | 'url'
  | 'html'
  | 'css'
  | 'svg'
  | 'colors'
  | 'seo'
  | 'git'
  | 'utilities'

export type ToolStatus = 'ready' | 'soon'

export interface ToolMeta {
  /** Stable identifier, also the last URL segment for tools under /tools. */
  slug: string
  /** Locale-relative route (next-intl Link). May differ from `/tools/${slug}`. */
  href: string
  title: string
  description: string
  category: ToolCategoryId
  keywords: string[]
  /** Extra search terms (abbreviations, synonyms). */
  aliases?: string[]
  icon: LucideIcon
  status: ToolStatus
  /** Surfaced in the "Popular" homepage rail. */
  popular?: boolean
  /** ISO date — drives the "Recently added" rail. */
  addedAt?: string
}

export interface CategoryMeta {
  id: ToolCategoryId
  label: string
  description: string
  icon: LucideIcon
}
