Component({
    relations: {
        '../alert-dialog/alert-dialog': { type: 'ancestor' }
    },
    data: {
        descApi: {} as any
    },
    methods: {
        updateFromParent(parentApi) {
            if (!parentApi) return
            this.setData({ descApi: parentApi.descriptionProps })
        }
    }
})
