import { CaseConverter } from '@/components/tools/impl/CaseConverter'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('case-converter')
export default makeToolPage('case-converter', CaseConverter)
