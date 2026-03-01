import { resolveClasses } from '../utils'

Component({
  externalClasses: ['ext-class'],
  properties: {
    extClass: { type: String, value: '' },
  },
  data: {
    className: '',
  },
  observers: {
    extClass: function (extClass) {
      this.setData({
        className: resolveClasses('ml-auto text-xs tracking-widest opacity-60', extClass),
      })
    },
  },
})
