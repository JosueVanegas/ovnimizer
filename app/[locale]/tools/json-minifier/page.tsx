import { JsonMinifier } from '@/components/tools/impl/JsonConverters'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('json-minifier')
export default makeToolPage('json-minifier', JsonMinifier)
