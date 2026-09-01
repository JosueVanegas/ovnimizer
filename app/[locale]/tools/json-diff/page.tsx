import { JsonDiff } from '@/components/tools/impl/JsonDiff'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('json-diff')
export default makeToolPage('json-diff', JsonDiff)
