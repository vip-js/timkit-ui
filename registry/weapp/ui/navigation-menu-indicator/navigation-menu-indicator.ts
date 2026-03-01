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
                className: cn('top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden', className),
            })
        },
    },
})
