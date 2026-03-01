import { dialogDescriptionVariants } from '@timui/core'

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
      const { baseClass } = resolveClasses(dialogDescriptionVariants(), extClass)
      this.setData({ baseClass })
    },
  },
})
