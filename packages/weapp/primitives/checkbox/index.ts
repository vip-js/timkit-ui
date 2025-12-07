import checkboxSchema from '../../../core/schemas/checkbox'
import type { WeappPrimitive } from '../../types'

const basePath = 'packages/weapp/primitives/checkbox'

// Fallback schema if not exists in core?
// We need to check if checkboxSchema exists. If not, mock it or use generic.
// Assuming it might not exist yet if I didn't create it. Defaulting to generic object for now.
const schema = checkboxSchema || {
  name: 'checkbox',
  cssVars: [],
  tokens: [],
}

export const weappCheckbox: WeappPrimitive = {
  name: 'checkbox',
  schema: schema as any,
  description: 'Weapp Checkbox (Custom View)',
  files: {
    wxml: `${basePath}/checkbox.wxml`,
    wxss: `${basePath}/checkbox.wxss`,
    logic: `${basePath}/checkbox.ts`,
    config: `${basePath}/checkbox.json`,
  },
}

export default weappCheckbox
