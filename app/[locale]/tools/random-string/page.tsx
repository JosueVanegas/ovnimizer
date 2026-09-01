import { RandomString } from '@/components/tools/impl/RandomString'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('random-string')
export default makeToolPage('random-string', RandomString)
