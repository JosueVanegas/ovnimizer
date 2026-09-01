import type { Metadata } from 'next'
import { CATEGORY_MAP, getTool } from './registry'

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://ovnimizer.com'

/** Per-tool Metadata: title, description, keywords, OG, Twitter, canonical. */
export function toolMetadata(slug: string, locale: string): Metadata {
  const tool = getTool(slug)
  if (!tool) return {}

  const title = `${tool.title} — Ovnimizer`
  const description = tool.description
  const canonical = `${SITE_URL}/${locale}${tool.href}`

  return {
    title,
    description,
    keywords: [...tool.keywords, ...(tool.aliases ?? [])],
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Ovnimizer',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

/** WebApplication + BreadcrumbList JSON-LD for a tool page. */
export function toolJsonLd(slug: string, locale: string): Record<string, unknown> | null {
  const tool = getTool(slug)
  if (!tool) return null
  const category = CATEGORY_MAP[tool.category]
  const url = `${SITE_URL}/${locale}${tool.href}`

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: tool.title,
        description: tool.description,
        url,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        browserRequirements: 'Requires JavaScript',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Tools', item: `${SITE_URL}/${locale}` },
          {
            '@type': 'ListItem',
            position: 2,
            name: category.label,
            item: `${SITE_URL}/${locale}/categories/${category.id}`,
          },
          { '@type': 'ListItem', position: 3, name: tool.title, item: url },
        ],
      },
    ],
  }
}

/** Renders a JSON-LD <script> tag. Use inside a server component. */
export function JsonLd({ data }: { data: Record<string, unknown> | null }) {
  if (!data) return null
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
