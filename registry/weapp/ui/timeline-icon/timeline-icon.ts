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
                className: cn('z-10 flex size-3 items-center justify-center rounded-full bg-primary ring-4 ring-background [&>svg]:size-2.5 [&>svg]:text-primary-foreground', className),
            })
        },
    },
})
