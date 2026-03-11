Component({
  relations: {
    '../select/select': { type: 'ancestor' },
  },
  properties: {
    htmlFor: { type: String, value: '' }, // Id of the group
  },
  data: {
    labelApi: {} as any,
  },
  methods: {
    updateFromParent(parentApi) {
      if (!parentApi) return
      const props = parentApi.getItemGroupLabelProps({ htmlFor: this.properties.htmlFor })
      this.setData({ labelApi: props })
    },
  },
})
