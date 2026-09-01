import { JsonValidator } from '@/components/tools/impl/JsonValidator'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('json-validator')
export default makeToolPage('json-validator', JsonValidator)
