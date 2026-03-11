Component({
  relations: {
    '../sheet/sheet': { type: 'ancestor' },
  },
  data: {
    triggerApi: {} as any,
  },
  methods: {
    updateFromParent(parentApi) {
      if (!parentApi) return
      this.setData({ triggerApi: parentApi.triggerProps })
    },
    handleClick() {
      if (this.data.triggerApi && this.data.triggerApi.onClick) {
        this.data.triggerApi.onClick()
      }
    },
  },
})
