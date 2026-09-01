import { FileBase64 } from '@/components/tools/impl/FileBase64'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('base64-file')
export default makeToolPage('base64-file', FileBase64)
