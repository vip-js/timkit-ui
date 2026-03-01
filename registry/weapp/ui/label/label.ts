import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const labelVariants = cva(
    'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
)

Component({
    properties: {
        className: { type: String, value: '' },
        for: { type: String, value: '' },
    },
    data: {
        className: '',
    },
    observers: {
        'className': function (className) {
            this.setData({
                className: cn(labelVariants(), className),
            })
        },
    },
})
