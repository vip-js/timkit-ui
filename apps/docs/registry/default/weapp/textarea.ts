import { textareaVariants } from '../utils'

Component({
  externalClasses: ['ext-class'],
  properties: {
    placeholder: { type: String, value: '' },
    value: { type: String, value: '' },
    disabled: { type: Boolean, value: false },
    extClass: { type: String, value: '' },
  },
  data: {
    className: '',
  },
  observers: {
    extClass: function (extClass) {
      this.setData({
        className: textareaVariants({ className: extClass }),
      })
    },
  },
  methods: {
    handleInput(e: any) {
      this.triggerEvent('input', e.detail)
    },
    handleFocus(e: any) {
      this.triggerEvent('focus', e.detail)
    },
    handleBlur(e: any) {
      this.triggerEvent('blur', e.detail)
    },
  },
})
