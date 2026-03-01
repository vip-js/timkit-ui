Component({
    properties: {
        className: {
            type: String,
            value: ''
        },
        defaultValue: {
            type: String,
            value: ''
        },
        // Array of {label: string, value: string}
        tabs: {
            type: Array,
            value: []
        }
    },
    data: {
        activeValue: ''
    },
    lifetimes: {
        attached() {
            if (this.data.defaultValue) {
                this.setData({ activeValue: this.data.defaultValue });
            } else if (this.data.tabs.length > 0) {
                this.setData({ activeValue: this.data.tabs[0].value });
            }
        }
    },
    methods: {
        handleTabClick(e) {
            const { value } = e.currentTarget.dataset;
            this.setData({ activeValue: value });
            this.triggerEvent('change', { value });
        }
    }
})
