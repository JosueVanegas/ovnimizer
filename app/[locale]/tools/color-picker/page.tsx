import { ColorPicker } from '@/components/tools/impl/ColorPicker'
import { makeToolMetadata, makeToolPage } from '@/lib/tools/page-factory'

export const generateMetadata = makeToolMetadata('color-picker')
export default makeToolPage('color-picker', ColorPicker)
