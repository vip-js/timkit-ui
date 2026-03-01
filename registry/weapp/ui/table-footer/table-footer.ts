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
                className: cn('bg-muted/50 border-t font-medium [&>tr]:last:border-b-0', className),
            })
        },
    },
})
