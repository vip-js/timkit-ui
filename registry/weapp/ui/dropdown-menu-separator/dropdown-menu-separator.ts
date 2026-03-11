Component({
  relations: {
    '../dropdown-menu/dropdown-menu': { type: 'ancestor' },
  },
  data: {
    separatorApi: {} as any,
  },
  methods: {
    updateFromParent(parentApi) {
      if (!parentApi) return
      this.setData({ separatorApi: parentApi.separatorProps })
    },
  },
})
