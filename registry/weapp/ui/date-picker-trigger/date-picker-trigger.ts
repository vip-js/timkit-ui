Component({
  relations: {
    '../date-picker/date-picker': { type: 'ancestor' },
  },
  data: {
    triggerApi: {} as any,
  },
  methods: {
    updateFromParent(parentApi) {
      if (!parentApi) return
      this.setData({ triggerApi: parentApi.triggerProps })
    },
    handleTap() {
      if (this.data.triggerApi.onClick) this.data.triggerApi.onClick()
    },
  },
})
