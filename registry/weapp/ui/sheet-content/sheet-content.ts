Component({
    relations: {
        '../sheet/sheet': { type: 'ancestor' }
    },
    properties: {
        side: { type: String, value: 'right' } // Content can also take side or inherit
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
