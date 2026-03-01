Component({
    relations: {
        '../select/select': { type: 'ancestor' }
    },
    properties: {
        id: { type: String, value: '' }
    },
    data: {
        groupApi: {} as any
    },
    methods: {
        updateFromParent(parentApi) {
            if (!parentApi) return
            const props = parentApi.getItemGroupProps({ id: this.properties.id })
            this.setData({ groupApi: props })
        }
    }
})
