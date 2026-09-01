import { HexRgb } from '@/components/tools/impl/HexRgb'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('hex-rgb')
export default makeToolPage('hex-rgb', HexRgb)
