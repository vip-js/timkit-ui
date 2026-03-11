import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

Component({
  externalClasses: ['custom-class'],
  options: {
    styleIsolation: 'apply-shared', // Allow global styles (Tailwind) to apply
    virtualHost: true, // Useful for layout
  },
  properties: {
    variant: { type: String, value: 'default' },
    size: { type: String, value: 'default' },
    className: { type: String, value: '' },
  },
  data: {
    className: '',
  },
  observers: {
    'variant, size, className': function (variant, size, className) {
      this.setData({
        className: cn(buttonVariants({ variant: variant as any, size: size as any }), className),
      })
    },
  },
  methods: {
    onTap(e: any) {
      if (!this.data.disabled && !this.data.loading) {
        this.triggerEvent('click', e.detail)
      }
    },
  },
})
