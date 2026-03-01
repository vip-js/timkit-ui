import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const notificationVariants = cva(
    'bg-background border-border relative flex w-full flex-col gap-1 rounded-lg border p-4 shadow-lg'
)

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
                className: cn(notificationVariants(), className),
            })
        },
    },
})
