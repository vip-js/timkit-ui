'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

import { cva, type VariantProps } from '../lib/cva'

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

const Separator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    orientation?: 'horizontal' | 'vertical'
    decorative?: boolean
  }
>(({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
  <div
    ref={ref}
    role={decorative ? 'none' : 'separator'}
    aria-orientation={decorative ? undefined : orientation}
    className={cn(separatorVariants({ orientation }), className)}
    {...props}
  />
))
Separator.displayName = 'Separator'

export { Separator, separatorVariants }
