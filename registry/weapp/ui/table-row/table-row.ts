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
                className: cn('border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', className),
            })
        },
    },
})
