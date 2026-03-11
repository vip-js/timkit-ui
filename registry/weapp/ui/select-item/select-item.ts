Component({
  relations: {
    '../select/select': { type: 'ancestor' },
  },
  properties: {
    item: { type: Object, value: {} },
  },
  data: {
    itemApi: {} as any,
  },
  methods: {
    updateFromParent(parentApi) {
      if (!parentApi) return
      // WeApp Select requires item object in props,
      // Zag expects item object.
      // We pass the whole item.
      const props = parentApi.getItemProps({ item: this.properties.item })
      this.setData({ itemApi: props })
    },
    handleClick() {
      if (this.data.itemApi && this.data.itemApi.onClick) {
        this.data.itemApi.onClick()
      }
    },
  },
})
