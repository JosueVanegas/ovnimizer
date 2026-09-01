import { JsonToTypeScript } from '@/components/tools/impl/JsonConverters'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('json-to-typescript')
export default makeToolPage('json-to-typescript', JsonToTypeScript)
