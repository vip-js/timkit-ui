import { cn } from '../../lib/utils'

Component({
    properties: {
        className: { type: String, value: '' },
        href: { type: String, value: '' },
    },
    data: {
        className: '',
    },
    observers: {
        'className': function (className) {
            this.setData({
                className: cn('transition-colors hover:text-foreground', className),
            })
        },
    },
    methods: {
        onTap() {
            if (this.properties.href) {
                wx.navigateTo({ url: this.properties.href })
            }
            this.triggerEvent('click')
        }
    }
})
