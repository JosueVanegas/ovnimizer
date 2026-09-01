import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import type { ComponentType } from 'react'
import { ToolShell } from '@/components/tools/ToolShell'
import { getTool } from './registry'
import { toolMetadata, toolJsonLd, JsonLd } from './seo'

type LocaleParams = { params: Promise<{ locale: string }> }

/** Factory for a tool page's `generateMetadata` export. */
export function makeToolMetadata(slug: string) {
  return async ({ params }: LocaleParams): Promise<Metadata> => {
    const { locale } = await params
    return toolMetadata(slug, locale)
  }
}

/** Factory for a tool page's default export — wires SEO + ToolShell + the tool UI. */
export function makeToolPage(slug: string, Tool: ComponentType) {
  return async function ToolPage({ params }: LocaleParams) {
    const { locale } = await params
    setRequestLocale(locale)
    const tool = getTool(slug)!
    return (
      <>
        <JsonLd data={toolJsonLd(slug, locale)} />
        <ToolShell tool={tool}>
          <Tool />
        </ToolShell>
      </>
    )
  }
}
