import { sheetDescriptionVariants } from '@timui/shared'

import { resolveClasses } from '../utils'

Component({
  properties: {
    extClass: { type: String, value: '' },
  },
  data: { baseClass: '' },
  observers: {
    extClass: function (extClass) {
      const { baseClass } = resolveClasses(sheetDescriptionVariants(), extClass)
      this.setData({ baseClass })
    },
  },
})
