Component({
  relations: {
    '../combobox/combobox': { type: 'ancestor' },
  },
  data: {
    inputApi: {} as any,
    value: '',
  },
  methods: {
    updateFromParent(parentApi) {
      if (!parentApi) return
      this.setData({
        inputApi: parentApi.inputProps,
        value: parentApi.inputProps.value,
      })
    },
    handleInput(e) {
      if (this.data.inputApi.onInput) {
        this.data.inputApi.onInput({ target: { value: e.detail.value } })
      }
      this.setData({ value: e.detail.value })
    },
    handleConfirm() {
      if (this.data.inputApi.onKeyDown) {
        this.data.inputApi.onKeyDown({ key: 'Enter', preventDefault: () => {} })
      }
    },
    handleFocus() {
      if (this.data.inputApi.onFocus) this.data.inputApi.onFocus()
    },
    handleBlur() {
      if (this.data.inputApi.onBlur) this.data.inputApi.onBlur()
    },
  },
})
