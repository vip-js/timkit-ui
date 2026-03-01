import { resolveClasses } from '../utils'

Component({
  externalClasses: ['ext-class'],
  properties: {
    inset: { type: Boolean, value: false },
    extClass: { type: String, value: '' },
  },
  data: {
    className: '',
  },
  observers: {
    'extClass, inset': function (extClass, inset) {
      const base = 'px-2 py-1.5 text-sm font-semibold'
      const insetClass = inset ? 'pl-8' : ''
      this.setData({
        className: resolveClasses(base, insetClass, extClass),
      })
    },
  },
})
