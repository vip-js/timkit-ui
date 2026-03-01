import { dialogTitleVariants } from '@timui/core'

import { resolveClasses } from '../utils'

Component({
  options: {
    styleIsolation: "apply-shared",
  },
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
