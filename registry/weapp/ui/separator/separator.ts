import { cva } from 'class-variance-authority'

import { cn } from '../../lib/utils'

const separatorVariants = cva('shrink-0 bg-border', {
  variants: {
    orientation: {
      horizontal: 'h-[1px] w-full',
      vertical: 'h-full w-[1px]',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
})

Component({
  properties: {
    className: { type: String, value: '' },
    orientation: { type: String, value: 'horizontal' },
    decorative: { type: Boolean, value: true },
  },
  data: {
    className: '',
  },
  observers: {
    'orientation, className': function (orientation, className) {
      this.setData({
        className: cn(separatorVariants({ orientation: orientation as any }), className),
      })
    },
  },
})
