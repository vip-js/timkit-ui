'use client'

import * as React from 'react'
import { cn, listBoxSectionVariants } from '@timui/core'

type ListBoxSectionProps = React.HTMLAttributes<HTMLDivElement>

const ListBoxSection = React.forwardRef<HTMLDivElement, ListBoxSectionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      data-slot="list-box-section"
      className={cn(listBoxSectionVariants(), className)}
      {...props}
    />
  )
)
ListBoxSection.displayName = 'ListBoxSection'

export { ListBoxSection }
