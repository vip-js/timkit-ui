Component({
    relations: {
        '../dialog/dialog': { type: 'ancestor' }
    },
    data: {
        contentApi: {} as any
    },
    methods: {
        updateFromParent(parentApi) {
            if (!parentApi) return
            this.setData({ contentApi: parentApi.contentProps })
        }
    }
})
