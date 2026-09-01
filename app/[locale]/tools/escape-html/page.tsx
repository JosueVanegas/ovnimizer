import { EscapeHtml } from '@/components/tools/impl/HtmlEscape'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('escape-html')
export default makeToolPage('escape-html', EscapeHtml)
