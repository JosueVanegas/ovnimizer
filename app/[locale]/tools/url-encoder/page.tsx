import { UrlEncoder } from '@/components/tools/impl/UrlEncoder'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('url-encoder')
export default makeToolPage('url-encoder', UrlEncoder)
