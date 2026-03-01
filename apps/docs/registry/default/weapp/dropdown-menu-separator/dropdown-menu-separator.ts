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
        className: resolveClasses('-mx-1 my-1 h-px bg-muted', extClass),
      })
    },
  },
})
