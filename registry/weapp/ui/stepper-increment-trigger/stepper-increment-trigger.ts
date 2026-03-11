Component({
  relations: {
    '../stepper/stepper': { type: 'ancestor' },
  },
  data: {
    triggerApi: {} as any,
  },
  methods: {
    updateFromParent(parentApi) {
      if (!parentApi) return
      this.setData({ triggerApi: parentApi.incrementTriggerProps })
    },
    handleTap() {
      if (this.data.triggerApi.onClick) this.data.triggerApi.onClick()
    },
  },
})
