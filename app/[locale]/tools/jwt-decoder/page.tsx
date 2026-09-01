import { JwtDecoder } from '@/components/tools/impl/JwtDecoder'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('jwt-decoder')
export default makeToolPage('jwt-decoder', JwtDecoder)
