import { cva } from 'class-variance-authority'

import { cn } from '../../lib/utils'

const alertVariants = cva(
  'relative w-full rounded-lg border border-border bg-background p-4 text-foreground',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive:
          'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

Component({
  properties: {
    className: { type: String, value: '' },
    variant: { type: String, value: 'default' },
  },
  data: {
    className: '',
  },
  observers: {
    'variant, className': function (variant, className) {
      this.setData({
        className: cn(alertVariants({ variant: variant as any }), className),
      })
    },
  },
})
