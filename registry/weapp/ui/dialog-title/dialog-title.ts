Component({
    relations: {
        '../dialog/dialog': { type: 'ancestor' }
    },
    data: {
        titleApi: {} as any
    },
    methods: {
        updateFromParent(parentApi) {
            if (!parentApi) return
            this.setData({ titleApi: parentApi.titleProps })
        }
    }
})
