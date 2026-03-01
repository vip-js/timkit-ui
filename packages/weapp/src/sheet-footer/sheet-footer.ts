import { sheetFooterVariants } from '@timui/core'

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
      const { baseClass } = resolveClasses(sheetFooterVariants(), extClass)
      this.setData({ baseClass })
    },
  },
})
