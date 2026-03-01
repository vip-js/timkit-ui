import { cardVariants } from '../utils'

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
        className: cardVariants({ className: extClass }),
      })
    },
  },
})
