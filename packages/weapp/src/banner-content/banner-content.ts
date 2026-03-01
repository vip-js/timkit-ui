import { bannerContentVariants } from '../utils'

Component({
  options: {
    styleIsolation: "apply-shared",
  },
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
        className: bannerContentVariants({ className: extClass }),
      })
    },
  },
})
