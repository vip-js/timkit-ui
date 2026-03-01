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
                className: cn(
                    'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                    className
                ),
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
