import { JsonToCsv } from '@/components/tools/impl/JsonConverters'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('json-to-csv')
export default makeToolPage('json-to-csv', JsonToCsv)
