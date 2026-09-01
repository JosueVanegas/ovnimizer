import { BorderRadius } from '@/components/tools/impl/BorderRadius'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('border-radius')
export default makeToolPage('border-radius', BorderRadius)
