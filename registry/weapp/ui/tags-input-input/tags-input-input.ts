Component({
    relations: {
        '../tags-input/tags-input': { type: 'ancestor' }
    },
    data: {
        inputApi: {} as any,
        inputValue: ''
    },
    methods: {
        updateFromParent(parentApi) {
            if (!parentApi) return
            this.setData({
                inputApi: parentApi.inputProps,
                inputValue: parentApi.inputProps.value
            })
        },
        handleInput(e) {
            if (this.data.inputApi && this.data.inputApi.onInput) {
                // Mock event for Zag
                this.data.inputApi.onInput({ target: { value: e.detail.value } })
            }
            this.setData({ inputValue: e.detail.value })
        },
        handleKeyDown(e) {
            if (this.data.inputApi && this.data.inputApi.onKeyDown) {
                // WeApp bindconfirm usually for enter
                // But bindkeyboardheightchange etc exists.
                // WeApp input has bindconfirm.
                // We might need to map WeApp events to DOM-like events Zag expects.
                // Zag expects 'Enter', 'Backspace', etc.
                // WeApp bindinput gives value.
                // WeApp bindconfirm gives value.
                // WeApp doesn't give key codes easily for all keys.
                // But basic Enter works.
            }
        },
        handleConfirm(e) {
            if (this.data.inputApi && this.data.inputApi.onKeyDown) {
                this.data.inputApi.onKeyDown({ key: 'Enter', preventDefault: () => { } })
            }
        },
        handleBlur(e) {
            if (this.data.inputApi && this.data.inputApi.onBlur) {
                this.data.inputApi.onBlur()
            }
        },
        handleFocus(e) {
            if (this.data.inputApi && this.data.inputApi.onFocus) {
                this.data.inputApi.onFocus()
            }
        }
    }
})
