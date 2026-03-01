Component({
    properties: {
        placeholder: { type: String, value: '' },
        value: { type: String, value: '' }
    },
    methods: {
        handleInput(e) {
            this.triggerEvent('input', e.detail)
        }
    }
})
