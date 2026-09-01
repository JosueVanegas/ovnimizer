import { BoxShadow } from '@/components/tools/impl/BoxShadow'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('box-shadow')
export default makeToolPage('box-shadow', BoxShadow)
