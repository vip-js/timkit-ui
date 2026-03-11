Component({
  relations: {
    '../dialog/dialog': { type: 'ancestor' },
  },
  data: {
    overlayApi: {} as any,
  },
  methods: {
    updateFromParent(parentApi) {
      if (!parentApi) return
      this.setData({ overlayApi: parentApi.backdropProps })
    },
    handleClick() {
      if (this.data.overlayApi && this.data.overlayApi.onClick) {
        this.data.overlayApi.onClick()
      }
    },
  },
})
