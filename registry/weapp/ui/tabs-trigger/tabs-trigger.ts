Component({
  relations: {
    '../tabs/tabs': { type: 'ancestor' },
  },
  properties: {
    value: { type: String, value: '' },
    disabled: { type: Boolean, value: false },
  },
  data: {
    triggerApi: {} as any,
  },
  methods: {
    updateFromParent(parentApi) {
      if (!parentApi) return
      const props = parentApi.getTriggerProps({
        value: this.properties.value,
        disabled: this.properties.disabled,
      })
      this.setData({ triggerApi: props })
    },
    handleClick() {
      if (this.data.triggerApi && this.data.triggerApi.onClick) {
        this.data.triggerApi.onClick()
      }
    },
  },
})
