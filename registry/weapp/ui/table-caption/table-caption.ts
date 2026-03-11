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
        className: cn('mt-4 text-sm text-muted-foreground', className),
      })
    },
  },
})
