'use client'

import * as React from 'react'
import { mergeProps } from '@zag-js/react'

// Simple Slot implementation standardizing accessible composition
interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

const Slot = React.forwardRef<HTMLElement, SlotProps>(({ children, ...props }, ref) => {
  if (React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...mergeProps(props, (children as any).props), // Zag's mergeProps handles event merging well
      // @ts-ignore
      ref: (node) => {
        // Handle merged refs
        if (typeof ref === 'function') ref(node)
        else if (ref) (ref as any).current = node

        // Handle child ref
        const childRef = (children as any).ref
        if (typeof childRef === 'function') childRef(node)
        else if (childRef) (childRef as any).current = node
      },
    } as any)
  }
  return null
})
Slot.displayName = 'Slot'

export { Slot }
