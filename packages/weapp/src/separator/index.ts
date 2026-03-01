import { separatorVariants } from '../utils'

type SeparatorOrientation = 'horizontal' | 'vertical'

function toOrientation(value: string): SeparatorOrientation {
    return value === 'vertical' ? 'vertical' : 'horizontal'
}

Component({
    options: {
        styleIsolation: 'apply-shared',
    },
    properties: {
        orientation: {
            type: String,
            value: 'horizontal',
        },
        decorative: {
            type: Boolean,
            value: false,
        },
        extClass: {
            type: String,
            value: '',
        },
    },
    data: {
        className: '',
    },
    lifetimes: {
        attached() {
            this._updateClass()
        },
    },
    observers: {
        'orientation, extClass': function () {
            this._updateClass()
        },
    },
    methods: {
        _updateClass() {
            const { orientation, extClass } = this.properties
            this.setData({
                className: separatorVariants({
                    orientation: toOrientation(orientation),
                    className: extClass,
                }),
            })
        },
    },
})
