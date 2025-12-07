import { dialogTitleVariants } from '@timui/shared'

import { resolveClasses } from '../utils'

Component({
  properties: {
    extClass: { type: String, value: '' },
  },
  data: { baseClass: '' },
  observers: {
    extClass: function (extClass) {
      const { baseClass } = resolveClasses(dialogTitleVariants(), extClass)
      this.setData({ baseClass })
    },
  },
})
