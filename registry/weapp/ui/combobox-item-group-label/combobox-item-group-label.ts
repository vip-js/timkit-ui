Component({
    relations: {
        '../combobox/combobox': { type: 'ancestor' }
    },
    properties: { htmlFor: { type: String, value: '' } },
    data: { labelApi: {} as any },
    methods: {
        updateFromParent(parentApi) {
            if (!parentApi) return
            this.setData({ labelApi: parentApi.getItemGroupLabelProps({ htmlFor: this.properties.htmlFor }) })
        }
    }
})
