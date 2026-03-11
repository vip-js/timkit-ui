import { sheetHeaderVariants } from '@timui/core'

import { resolveClasses } from '../utils'

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],
  properties: {
    extClass: { type: String, value: '' },
  },
  data: { baseClass: '' },
  observers: {
    extClass: function (extClass) {
      const { baseClass } = resolveClasses(sheetHeaderVariants(), extClass)
      this.setData({ baseClass })
    },
  },
})
