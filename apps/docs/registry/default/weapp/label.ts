import { labelVariants } from '../utils'

Component({
  externalClasses: ['ext-class'],
  properties: {
    // Label for WeApp is mostly styling as 'label for' binding is not automatic.
    extClass: { type: String, value: '' },
  },
  data: {
    labelClass: '',
  },
  observers: {
    extClass: function (extClass) {
      this.setData({
        labelClass: labelVariants({ className: extClass }),
      })
    },
  },
})
