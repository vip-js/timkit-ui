Component({
    relations: {
        '../combobox/combobox': { type: 'ancestor' }
    },
    data: {
        controlApi: {} as any
    },
    methods: {
        updateFromParent(parentApi) {
            if (!parentApi) return
            this.setData({ controlApi: parentApi.controlProps })
        },
        handleTap() {
            if (this.data.controlApi.onClick) this.data.controlApi.onClick()
        }
    }
})
