Component({
    relations: {
        '../accordion/index': {
            type: 'parent',
            linked(target) {
                this.parent = target
            },
            unlinked() {
                this.parent = null
            }
        }
    },
    properties: {
        value: {
            type: String,
            value: ''
        },
        disabled: {
            type: Boolean,
            value: false
        },
        className: {
            type: String,
            value: ''
        },
        iconExpandedClass: {
            type: String,
            value: 'rotate-180'
        }
    },
    data: {
        expanded: false
    },
    methods: {
        onTap(e) {
            if (this.data.disabled) return
            if (this.parent) {
                this.parent.handleItemTap(this.data.value)
            }
        }
    }
})
