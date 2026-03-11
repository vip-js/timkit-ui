Component({
  relations: {
    '../select/select': { type: 'ancestor' },
  },
  data: {
    labelApi: {} as any,
  },
  methods: {
    updateFromParent(parentApi) {
      // Zag Select Label is usually for the group or the control label.
      // If this is the label FOR the select (control label), parentApi.labelProps.
      if (parentApi && parentApi.labelProps) {
        this.setData({ labelApi: parentApi.labelProps })
      }
    },
  },
})
