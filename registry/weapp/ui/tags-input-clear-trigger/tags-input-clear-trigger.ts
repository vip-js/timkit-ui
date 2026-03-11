Component({
  relations: {
    '../tags-input/tags-input': { type: 'ancestor' },
  },
  data: {
    triggerApi: {} as any,
  },
  methods: {
    updateFromParent(parentApi) {
      if (!parentApi) return
      this.setData({ triggerApi: parentApi.clearTriggerProps })
    },
    handleClick() {
      if (this.data.triggerApi && this.data.triggerApi.onClick) {
        this.data.triggerApi.onClick()
      }
    },
  },
})
