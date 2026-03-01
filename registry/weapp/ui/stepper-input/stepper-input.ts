Component({
    relations: {
        '../stepper/stepper': { type: 'ancestor' }
    },
    data: {
        inputApi: {} as any,
        value: ''
    },
    methods: {
        updateFromParent(parentApi) {
            if (!parentApi) return
            this.setData({
                inputApi: parentApi.inputProps,
                value: parentApi.inputProps.value
            })
        },
        handleInput(e) {
            // Zag NumberInput works by parsing input.
            // We can mock the onChange/onInput
            if (this.data.inputApi.onInput) {
                this.data.inputApi.onInput({ target: { value: e.detail.value } })
            }
            this.setData({ value: e.detail.value })
        },
        handleBlur() {
            if (this.data.inputApi.onBlur) this.data.inputApi.onBlur()
        }
    }
})
