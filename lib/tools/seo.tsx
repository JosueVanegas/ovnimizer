import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CATEGORY_MAP, getTool } from './registry'

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://ovnimizer.com'

/** Per-tool Metadata: title, description, keywords, OG, Twitter, canonical. */
export async function toolMetadata(slug: string, locale: string): Promise<Metadata> {
  const tool = getTool(slug)
  if (!tool) return {}

  const t = await getTranslations({ locale, namespace: 't' })
  const localizedTitle = t.has(`${slug}.title`) ? t(`${slug}.title`) : tool.title
  const localizedDesc = t.has(`${slug}.desc`) ? t(`${slug}.desc`) : tool.description

  const title = `${localizedTitle} — Ovnimizer`
  const description = localizedDesc
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
export async function toolJsonLd(
  slug: string,
  locale: string,
): Promise<Record<string, unknown> | null> {
  const tool = getTool(slug)
  if (!tool) return null
  const category = CATEGORY_MAP[tool.category]
  const url = `${SITE_URL}/${locale}${tool.href}`

  const t = await getTranslations({ locale, namespace: 't' })
  const tCat = await getTranslations({ locale, namespace: 'cat' })
  const tc = await getTranslations({ locale, namespace: 'common' })
  const name = t.has(`${slug}.title`) ? t(`${slug}.title`) : tool.title
  const description = t.has(`${slug}.desc`) ? t(`${slug}.desc`) : tool.description
  const categoryLabel = tCat(`${tool.category}.label`)
  const toolsLabel = tc('tools')

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name,
        description,
        url,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        browserRequirements: 'Requires JavaScript',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: toolsLabel, item: `${SITE_URL}/${locale}` },
          {
            '@type': 'ListItem',
            position: 2,
            name: categoryLabel,
            item: `${SITE_URL}/${locale}/categories/${category.id}`,
          },
          { '@type': 'ListItem', position: 3, name, item: url },
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
