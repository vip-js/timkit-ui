import { dialogTitleVariants } from '@timui/core'

import { resolveClasses } from '../utils'
import {
  createWeappBaseProps,
  createWeappOptions,
  WEAPP_EXTERNAL_CLASSES,
} from '../utils/component'

Component({
  options: createWeappOptions({ pureData: true }),
  externalClasses: WEAPP_EXTERNAL_CLASSES,
  properties: {
    ...createWeappBaseProps(),
  },
  data: { baseClass: '' },
  observers: {
    extClass: function (extClass) {
      const { baseClass } = resolveClasses(dialogTitleVariants(), extClass)
      this.setData({ baseClass })
    },
  },
})
