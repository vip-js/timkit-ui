Component({
  relations: {
    '../date-picker/date-picker': { type: 'ancestor' },
  },
  data: {
    contentApi: {} as any,
  },
  methods: {
    updateFromParent(parentApi) {
      if (!parentApi) return
      this.setData({ contentApi: parentApi.contentProps })
    },
  },
})
