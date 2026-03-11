Component({
  relations: {
    '../tags-input/tags-input': { type: 'ancestor' },
  },
  data: {
    labelApi: {} as any,
  },
  methods: {
    updateFromParent(parentApi) {
      if (!parentApi) return
      this.setData({ labelApi: parentApi.labelProps })
    },
  },
})
