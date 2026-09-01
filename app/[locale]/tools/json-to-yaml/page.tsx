import { JsonToYaml } from '@/components/tools/impl/JsonConverters'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('json-to-yaml')
export default makeToolPage('json-to-yaml', JsonToYaml)
