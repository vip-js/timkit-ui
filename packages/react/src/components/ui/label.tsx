'use client'

import * as React from 'react'
import { cn, labelVariants } from '@timui/core'

const Label = React.memo(
  React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
    ({ className, htmlFor, onClick, ...props }, ref) => (
      <label
        ref={ref}
        data-slot="label"
        htmlFor={htmlFor}
        className={cn(labelVariants(), className)}
        {...props}
        onClick={(event) => {
          onClick?.(event)
          if (event.defaultPrevented || !htmlFor) return
          const field = event.currentTarget.ownerDocument.getElementById(htmlFor)
          if (field instanceof HTMLElement && event.currentTarget.ownerDocument.activeElement !== field) {
            field.focus()
          }
        }}
      />
    )
  )
)
Label.displayName = 'Label'

export { Label }
