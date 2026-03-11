Component({
  properties: {
    items: { type: Array, value: [] },
    value: { type: Array, value: [] },
    disabled: { type: Boolean, value: false },
    placeholder: { type: String, value: 'Select items...' },
  },
  methods: {
    handleChange(e) {
      this.triggerEvent('change', e.detail)
      this.triggerEvent('update:value', e.detail.value)
    },
  },
})
