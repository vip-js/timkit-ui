import { alertVariants } from '../utils'

Component({
  options: {
    styleIsolation: "apply-shared",
  },
  externalClasses: ['ext-class'],
  properties: {
    variant: {
      type: String,
      value: 'default',
    },
    extClass: {
      type: String,
      value: '',
    },
  },
  data: {
    className: '',
  },
  observers: {
    'variant, extClass': function (variant, extClass) {
      this.setData({
        className: alertVariants({ variant, className: extClass }),
      })
    },
  },
})
