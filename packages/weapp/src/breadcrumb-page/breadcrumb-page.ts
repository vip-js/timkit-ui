import { breadcrumbPageVariants } from '../utils'

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
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
        className: breadcrumbPageVariants({ className: extClass }),
      })
    },
  },
})
