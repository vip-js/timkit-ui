import { cn } from '../../lib/utils'

Component({
  properties: {
    className: { type: String, value: '' },
  },
  data: {
    className: '',
  },
  observers: {
    className: function (className) {
      this.setData({
        className: cn('flex items-center', className),
      })
    },
  },
})
