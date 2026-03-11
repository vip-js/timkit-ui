'use client'

import * as React from 'react'
import { cn } from '@timui/core'

const DateRangePicker = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="date-range-picker" className={cn(className)} {...props} />
  )
)
DateRangePicker.displayName = 'DateRangePicker'

export { DateRangePicker }
