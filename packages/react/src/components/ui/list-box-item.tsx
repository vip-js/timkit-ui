'use client'

import * as React from 'react'
import { cn } from '@timui/core'

interface ListBoxItemProps extends React.HTMLAttributes<HTMLDivElement> {
  isDisabled?: boolean
}

const ListBoxItem = React.forwardRef<HTMLDivElement, ListBoxItemProps>(
  ({ className, isDisabled, ...props }, ref) => (
    <div
      ref={ref}
      role="option"
      data-slot="list-box-item"
      data-disabled={isDisabled ? 'true' : undefined}
      className={cn(className)}
      {...props}
    />
  )
)
ListBoxItem.displayName = 'ListBoxItem'

export { ListBoxItem }
