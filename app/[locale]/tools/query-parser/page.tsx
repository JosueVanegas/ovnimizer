import { QueryParser } from '@/components/tools/impl/QueryParser'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('query-parser')
export default makeToolPage('query-parser', QueryParser)
