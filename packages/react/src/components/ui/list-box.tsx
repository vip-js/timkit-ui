'use client'

import * as React from 'react'
import { cn } from '@timui/core'

const ListBox = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} role="listbox" data-slot="list-box" className={cn(className)} {...props} />
  )
)
ListBox.displayName = 'ListBox'

export { ListBox }
