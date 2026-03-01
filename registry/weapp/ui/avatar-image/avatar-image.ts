Component({
    relations: {
        '../avatar/avatar': { type: 'ancestor' }
    },
    properties: {
        src: { type: String, value: '' }
    },
    data: {
        imageApi: {} as any
    },
    methods: {
        updateFromParent(parentApi) {
            if (!parentApi) return
            this.setData({ imageApi: parentApi.imageProps })
        },
        handleLoad() {
            if (this.data.imageApi && this.data.imageApi.onLoad) {
                this.data.imageApi.onLoad()
            }
        },
        handleError() {
            if (this.data.imageApi && this.data.imageApi.onError) {
                this.data.imageApi.onError()
            }
        }
    }
})
