Component({
  relations: {
    '../tags-input/tags-input': { type: 'ancestor' },
  },
  data: {
    controlApi: {} as any,
  },
  methods: {
    updateFromParent(parentApi) {
      if (!parentApi) return
      this.setData({ controlApi: parentApi.controlProps })
    },
    handleClick() {
      if (this.data.controlApi && this.data.controlApi.onClick) {
        this.data.controlApi.onClick()
      }
    },
  },
})
