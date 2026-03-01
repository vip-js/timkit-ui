import { labelVariants } from '../utils'

type TapEvent = WechatMiniprogram.BaseEvent<{
    value?: string
}>

Component({
    options: {
        styleIsolation: 'apply-shared',
    },

    properties: {
        for: { type: String, value: '' },
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
        'extClass': function () {
            this.updateClassName()
        },
    },

    methods: {
        updateClassName() {
            // Use core package's labelVariants for consistent styling
            const { baseClass } = labelVariants({
                className: this.properties.extClass
            })

            this.setData({ className: baseClass })
        },

        onTap(e: TapEvent) {
            this.triggerEvent('tap', e.detail)
        },
    },
})
