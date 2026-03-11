'use client'

import * as React from 'react'
import { cn, separatorVariants } from '@timui/core'

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

export { Separator }
