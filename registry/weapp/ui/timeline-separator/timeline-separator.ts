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
        className: cn(
          'absolute left-0 top-0 flex h-full flex-col items-center justify-center',
          className
        ),
      })
    },
  },
})
