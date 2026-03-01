Component({
    relations: {
        '../combobox/combobox': { type: 'ancestor' }
    },
    properties: { id: { type: String, value: '' } },
    data: { groupApi: {} as any },
    methods: {
        updateFromParent(parentApi) {
            if (!parentApi) return
            this.setData({ groupApi: parentApi.getItemGroupProps({ id: this.properties.id }) })
        }
    }
})
