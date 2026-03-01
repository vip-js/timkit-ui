Component({
    relations: {
        '../accordion-item/accordion-item': {
            type: 'ancestor'
        }
    },
    data: {
        triggerApi: {} as any
    },
    methods: {
        updateFromItem(parentApi, value) {
            if (!parentApi) return
            const triggerProps = parentApi.getTriggerProps({ value })
            this.setData({ triggerApi: triggerProps })
        },

        handleClick() {
            // Trigger toggle
            if (this.data.triggerApi && this.data.triggerApi.onClick) {
                this.data.triggerApi.onClick()
            }
        }
    }
})
