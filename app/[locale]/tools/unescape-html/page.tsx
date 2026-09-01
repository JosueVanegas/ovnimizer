import { UnescapeHtml } from '@/components/tools/impl/HtmlEscape'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('unescape-html')
export default makeToolPage('unescape-html', UnescapeHtml)
