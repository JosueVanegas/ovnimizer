import { SitemapGenerator } from '@/components/tools/impl/SitemapGenerator'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('sitemap-generator')
export default makeToolPage('sitemap-generator', SitemapGenerator)
