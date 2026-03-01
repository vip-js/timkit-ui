Component({
    relations: {
        '../dropdown-menu/dropdown-menu': { type: 'ancestor' }
    },
    properties: {
        value: { type: String, value: '' }
    },
    data: {
        itemApi: {} as any
    },
    methods: {
        updateFromParent(parentApi) {
            if (!parentApi) return
            const props = parentApi.getItemProps({ value: this.properties.value })
            this.setData({ itemApi: props })
        },
        handleClick() {
            if (this.data.itemApi && this.data.itemApi.onClick) {
                this.data.itemApi.onClick()
            }
        }
    }
})
