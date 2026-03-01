import { separatorVariants } from '../utils'

Component({
    options: {
        styleIsolation: 'apply-shared',
    },

    properties: {
        orientation: { type: String, value: 'horizontal' },
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
            // Use core package's separatorVariants for consistent styling
            const { baseClass } = separatorVariants({
                orientation: this.properties.orientation || 'horizontal',
                className: this.properties.extClass
            })

            this.setData({ className: baseClass })
        },
    },
})
