import { cn } from '../utils'

Component({
  externalClasses: ['ext-class'],
  properties: {
    extClass: {
      type: String,
      value: '',
    },
  },
  data: {
    className: '',
  },
  observers: {
    extClass: function (extClass) {
      this.setData({
        className: cn('w-fit', extClass),
      })
    },
  },
})
