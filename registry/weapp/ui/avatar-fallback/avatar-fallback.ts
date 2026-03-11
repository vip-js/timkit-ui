Component({
  relations: {
    '../avatar/avatar': { type: 'ancestor' },
  },
  data: {
    fallbackApi: {} as any,
  },
  methods: {
    updateFromParent(parentApi) {
      if (!parentApi) return
      this.setData({ fallbackApi: parentApi.fallbackProps })
    },
  },
})
