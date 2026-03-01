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
      const base =
        'z-50 min-w-40 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg'
      this.setData({
        className: resolveClasses(base, extClass),
      })
    },
  },
})
