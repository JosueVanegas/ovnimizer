import { QrReader } from '@/components/tools/impl/QrReader'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('qr-reader')
export default makeToolPage('qr-reader', QrReader)
