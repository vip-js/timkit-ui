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
        className: cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className),
      })
    },
  },
})
