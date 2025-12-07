import { buttonVariants } from '@timui/shared'

import { resolveClasses } from '../utils'

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
      const { baseClass, hoverClass } = resolveClasses(
        buttonVariants({ variant: variant as any, size: size as any }),
        className
      )
      this.setData({
        baseClass,
        hoverClass,
      })
    },
  },
  methods: {
    handleTap(e: any) {
      this.triggerEvent('tap', e) // Forward event just in case
    },
  },
})
