Component({
  relations: {
    '../sheet/sheet': { type: 'ancestor' },
  },
  data: {
    descApi: {} as any,
  },
  methods: {
    updateFromParent(parentApi) {
      if (!parentApi) return
      this.setData({ descApi: parentApi.descriptionProps })
    },
  },
})
