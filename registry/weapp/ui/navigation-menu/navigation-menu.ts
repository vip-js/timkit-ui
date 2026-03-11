import { cn } from '../../lib/utils'

Component({
  properties: {
    className: { type: String, value: '' },
  },
  relations: {
    '../navigation-menu-item/navigation-menu-item': {
      type: 'descendant',
    },
  },
  data: {
    className: '',
  },
  observers: {
    className: function (className) {
      this.setData({
        className: cn('relative z-10 flex max-w-max flex-1 items-center justify-center', className),
      })
    },
  },
})
