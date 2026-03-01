Component({
  externalClasses: ['ext-class'],
  properties: {
    value: {
      type: String,
      value: '',
    },
    type: {
      type: String,
      value: 'text',
    },
    password: {
      type: Boolean,
      value: false,
    },
    placeholder: {
      type: String,
      value: '',
    },
    disabled: {
      type: Boolean,
      value: false,
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
