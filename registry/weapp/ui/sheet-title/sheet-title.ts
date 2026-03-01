Component({
    relations: {
        '../sheet/sheet': { type: 'ancestor' }
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
