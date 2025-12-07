import buttonSchema from '../../../core/schemas/button'
import type { WeappPrimitive } from '../../types'

const basePath = 'packages/weapp/primitives/button'

export const weappButton: WeappPrimitive = {
  name: 'button',
  schema: buttonSchema,
  description:
    '微信小程序版本的 Button，遵循核心 schema，提供 primary / secondary / ghost / destructive 等语义样式。',
  files: {
    wxml: `${basePath}/button.wxml`,
    wxss: `${basePath}/button.wxss`,
    logic: `${basePath}/button.ts`,
  },
  tokens: buttonSchema.tokens,
}

export default weappButton
