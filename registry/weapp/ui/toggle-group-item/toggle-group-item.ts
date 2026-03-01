Component({
    relations: {
        '../toggle-group/toggle-group': { type: 'ancestor' }
    },
    properties: {
        value: { type: String, value: '' },
        disabled: { type: Boolean, value: false }
    },
    data: {
        itemApi: {} as any
    },
    methods: {
        updateFromParent(parentApi) {
            if (!parentApi) return
            const props = parentApi.getItemProps({ value: this.properties.value, disabled: this.properties.disabled })
            this.setData({ itemApi: props })
        },
        handleClick() {
            if (this.data.itemApi && this.data.itemApi.onClick) {
                this.data.itemApi.onClick()
            }
        }
    }
})
