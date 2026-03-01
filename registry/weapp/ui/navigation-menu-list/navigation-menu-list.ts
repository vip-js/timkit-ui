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
                className: cn('group flex flex-1 list-none items-center justify-center space-x-1', className),
            })
        },
    },
})
