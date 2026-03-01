Component({
    relations: {
        '../combobox/combobox': { type: 'ancestor' }
    },
    properties: {
        item: { type: Object, value: {} }
    },
    data: {
        itemApi: {} as any
    },
    methods: {
        updateFromParent(parentApi) {
            if (!parentApi) return
            const props = parentApi.getItemProps({ item: this.properties.item })
            this.setData({ itemApi: props })
        },
        handleTap() {
            if (this.data.itemApi.onClick) this.data.itemApi.onClick()
        }
    }
})
