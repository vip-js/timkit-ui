'use client'

import * as React from 'react'
import { cn, labelVariants } from '@timui/core'

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label ref={ref} className={cn(labelVariants(), className)} {...props} />
  )
)
Label.displayName = 'Label'

export { Label }
