'use client'

import * as React from 'react'
import { cn } from '@timui/core'

const Group = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="group" className={cn(className)} {...props} />
  )
)
Group.displayName = 'Group'

export { Group }
