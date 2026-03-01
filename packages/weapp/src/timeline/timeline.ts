import { timelineVariants } from '../utils'

Component({
    options: {
        styleIsolation: 'apply-shared',
    },

    properties: {
        items: { type: Array, value: [] },
        orientation: { type: String, value: 'vertical' },
        extClass: { type: String, value: '' },
    },

    data: {
        className: '',
    },

    lifetimes: {
        attached() {
            this.updateClassName()
        },
    },

    observers: {
        'orientation, extClass': function () {
            this.updateClassName()
        },
    },

    methods: {
        updateClassName() {
            // Use core package's timelineVariants for consistent styling
            const { baseClass } = timelineVariants({
                className: this.properties.extClass
            })

            this.setData({ className: baseClass })
        },
    },
})
