Component({
  properties: {
    value: { type: Array, value: [] },
  },
  methods: {
    handleChange(e) {
      this.triggerEvent('change', e.detail)
      this.triggerEvent('update:value', e.detail.value)
    },
  },
})
