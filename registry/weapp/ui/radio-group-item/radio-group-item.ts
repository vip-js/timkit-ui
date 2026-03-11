Component({
  relations: {
    '../radio-group/radio-group': {
      type: 'ancestor',
    },
  },
  properties: {
    value: { type: String, value: '' },
    disabled: { type: Boolean, value: false },
  },

  data: {
    itemApi: {} as any,
    checked: false,
  },

  methods: {
    updateFromParent(parentApi) {
      if (!parentApi || !parentApi.getItemProps) return

      const itemProps = parentApi.getItemProps({
        value: this.properties.value,
        disabled: this.properties.disabled,
      })
      const itemState = parentApi.getItemState({
        value: this.properties.value,
        disabled: this.properties.disabled,
      })
      this.setData({
        itemApi: itemProps,
        checked: itemState.checked,
      })
    },

    handleClick() {
      if (this.data.itemApi && this.data.itemApi.onClick) {
        this.data.itemApi.onClick()
      }
    },
  },
})
