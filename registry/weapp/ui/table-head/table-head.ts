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
                className: cn('h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0', className),
            })
        },
    },
})
