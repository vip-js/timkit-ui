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
                className: cn('relative flex w-full items-center justify-between gap-4 border-b bg-muted/30 px-4 py-3', className),
            })
        },
    },
})
