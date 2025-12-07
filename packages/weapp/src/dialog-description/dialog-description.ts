import { dialogDescriptionVariants } from '@timui/shared'

import { resolveClasses } from '../utils'

Component({
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
