import { MetadataGenerator } from '@/components/tools/impl/MetadataGenerator'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('metadata-generator')
export default makeToolPage('metadata-generator', MetadataGenerator)
