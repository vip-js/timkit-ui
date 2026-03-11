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
        className: cn('rounded-lg border bg-card text-card-foreground shadow-sm', className),
      })
    },
  },
})
