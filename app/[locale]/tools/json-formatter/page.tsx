import { JsonFormatter } from '@/components/tools/impl/JsonFormatter'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('json-formatter')
export default makeToolPage('json-formatter', JsonFormatter)
