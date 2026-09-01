import { UrlBuilder } from '@/components/tools/impl/UrlBuilder'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('url-builder')
export default makeToolPage('url-builder', UrlBuilder)
