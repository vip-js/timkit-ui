'use client'

import * as React from 'react'
import { cn } from '@timui/core'

const Header = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="header" className={cn(className)} {...props} />
  )
)
Header.displayName = 'Header'

export { Header }
