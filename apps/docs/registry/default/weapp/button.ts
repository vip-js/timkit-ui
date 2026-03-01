import { buttonVariants } from '../utils'

Component({
  externalClasses: ['ext-class'],
  properties: {
    variant: {
      type: String,
      value: 'default',
    },
    size: {
      type: String,
      value: 'default',
    },
    className: {
      type: String,
      value: '',
    },
  },
  data: {
    baseClass: '',
    hoverClass: '',
  },
  observers: {
    'variant, size, className': function (variant, size, className) {
      this.setData({
        baseClass: buttonVariants({ variant, size, className }),
        hoverClass: '',
      })
    },
  },
  methods: {
    handleTap(e: any) {
      this.triggerEvent('tap', e)
    },
  },
})
