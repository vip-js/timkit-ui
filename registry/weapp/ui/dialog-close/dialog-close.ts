Component({
  relations: {
    '../dialog/dialog': { type: 'ancestor' },
  },
  data: {
    closeApi: {} as any,
  },
  methods: {
    updateFromParent(parentApi) {
      if (!parentApi) return
      this.setData({ closeApi: parentApi.closeTriggerProps })
    },
    handleClick() {
      if (this.data.closeApi && this.data.closeApi.onClick) {
        this.data.closeApi.onClick()
      }
    },
  },
})
