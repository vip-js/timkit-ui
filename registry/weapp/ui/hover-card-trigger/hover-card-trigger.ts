Component({
  relations: {
    '../hover-card/hover-card': { type: 'ancestor' },
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
      // Same as Tooltip, hover card on mobile is tricky.
      // Mapping tap to focus for now.
      if (this.data.triggerApi.onFocus) this.data.triggerApi.onFocus()
    },
  },
})
