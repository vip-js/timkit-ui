Component({
  relations: {
    '../tabs/tabs': { type: 'ancestor' },
  },
  data: {
    listApi: {} as any,
  },
  methods: {
    updateFromParent(parentApi) {
      if (!parentApi) return
      this.setData({ listApi: parentApi.listProps })
    },
  },
})
