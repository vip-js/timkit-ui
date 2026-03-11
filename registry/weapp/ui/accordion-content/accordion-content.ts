Component({
  relations: {
    '../accordion-item/accordion-item': {
      type: 'ancestor',
    },
  },
  data: {
    contentApi: {} as any,
  },
  methods: {
    updateFromItem(parentApi, value) {
      if (!parentApi) return
      const contentProps = parentApi.getContentProps({ value })
      this.setData({ contentApi: contentProps })
    },
  },
})
