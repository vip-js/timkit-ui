import { cn } from '../../lib/utils'

Component({
    properties: {
        className: { type: String, value: '' },
    },
    relations: {
        '../navigation-menu/navigation-menu': {
            type: 'ancestor',
        },
    },
    data: {
        className: '',
    },
    observers: {
        'className': function (className) {
            this.setData({
                className: cn('relative', className),
            })
        },
    },
})
