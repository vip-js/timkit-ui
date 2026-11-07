'use client'

import * as React from 'react'
import { cn, separatorVariants } from '@timui/core'

const Separator = React.memo(
  React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    orientation?: 'horizontal' | 'vertical'
    decorative?: boolean
  }
>(({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="separator"
    data-orientation={orientation}
    className={cn(separatorVariants({ orientation }), className)}
    {...props}
    role={decorative ? 'none' : 'separator'}
    aria-orientation={decorative ? undefined : orientation}
  />
  ))
)
Separator.displayName = 'Separator'

export { Separator }
