'use client'

import * as React from 'react'
import { cn } from '@timui/core'

const StatusDot = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      data-slot="status-dot"
      aria-hidden="true"
      className={cn('inline-block size-2 rounded-full bg-current', className)}
      {...props}
    />
  )
)
StatusDot.displayName = 'StatusDot'

export { StatusDot }
