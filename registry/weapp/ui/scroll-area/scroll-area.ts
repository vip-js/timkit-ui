import { cn } from '../../lib/utils'

Component({
    properties: {
        className: { type: String, value: '' },
        orientation: { type: String, value: 'vertical' }, // vertical, horizontal, both
    },
    data: {
        className: '',
    },
    observers: {
        'className': function (className) {
            this.setData({
                className: cn('relative overflow-hidden', className),
            })
        },
    },
})
