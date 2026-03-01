Component({
    relations: {
        '../alert-dialog/alert-dialog': { type: 'ancestor' }
    },
    data: {
        cancelApi: {} as any
    },
    methods: {
        updateFromParent(parentApi) {
            if (!parentApi) return
            // We use closeTriggerProps for Cancel button too as it closes logic
            this.setData({ cancelApi: parentApi.closeTriggerProps })
        },
        handleClick() {
            if (this.data.cancelApi && this.data.cancelApi.onClick) {
                this.data.cancelApi.onClick()
            }
        }
    }
})
