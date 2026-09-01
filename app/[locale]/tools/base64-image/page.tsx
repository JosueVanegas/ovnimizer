import { ImageBase64 } from '@/components/tools/impl/ImageBase64'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('base64-image')
export default makeToolPage('base64-image', ImageBase64)
