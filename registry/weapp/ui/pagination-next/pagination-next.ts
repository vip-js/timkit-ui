import { cn } from '../../lib/utils'

Component({
    properties: {
        className: { type: String, value: '' },
    },
    data: {
        className: '',
    },
    observers: {
        'className': function (className) {
            this.setData({
                className: cn('gap-1 pr-2.5', className),
            })
        },
    },
    methods: {
        onTap(e: any) {
            this.triggerEvent('click', e.detail)
        }
    }
})
