import { QrGenerator } from '@/components/tools/impl/QrGenerator'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('qr-generator')
export default makeToolPage('qr-generator', QrGenerator)
