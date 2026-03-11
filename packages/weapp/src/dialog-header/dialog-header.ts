import { dialogHeaderVariants } from '@timui/core'

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
      const { baseClass } = resolveClasses(dialogHeaderVariants(), extClass)
      this.setData({ baseClass })
    },
  },
})
