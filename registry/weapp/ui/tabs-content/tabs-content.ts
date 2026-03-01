Component({
    relations: {
        '../tabs/tabs': { type: 'ancestor' }
    },
    properties: {
        value: { type: String, value: '' }
    },
    data: {
        contentApi: {} as any
    },
    methods: {
        updateFromParent(parentApi) {
            if (!parentApi) return
            const props = parentApi.getContentProps({ value: this.properties.value })
            this.setData({ contentApi: props })
        }
    }
})
