'use client'

import * as React from 'react'
import { cn } from '@timui/core'

const NumberField = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="number-field" className={cn(className)} {...props} />
  )
)
NumberField.displayName = 'NumberField'

export { NumberField }
