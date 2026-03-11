'use client'

import * as React from 'react'
import { cn } from '@timui/core'

const ListBoxSection = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} role="group" data-slot="list-box-section" className={cn(className)} {...props} />
  )
)
ListBoxSection.displayName = 'ListBoxSection'

export { ListBoxSection }
