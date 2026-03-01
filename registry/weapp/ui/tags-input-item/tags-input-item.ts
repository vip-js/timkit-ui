Component({
    relations: {
        '../tags-input/tags-input': { type: 'ancestor' }
    },
    properties: {
        index: { type: Number, value: 0 },
        value: { type: String, value: '' }
    },
    data: {
        itemApi: {} as any
    },
    methods: {
        updateFromParent(parentApi) {
            if (!parentApi) return
            const props = parentApi.getItemProps({ index: this.properties.index, value: this.properties.value })
            this.setData({ itemApi: props })
        },
        handleDelete() {
            // Find parent and call delete
            // Or if local api has a delete handler?
            // Zag doesn't expose delete handler on item props directly?
            // Usually delete trigger does it.
        }
    }
})
