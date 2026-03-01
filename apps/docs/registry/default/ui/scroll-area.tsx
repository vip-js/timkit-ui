'use client'

import * as React from 'react'
import { cn } from '@timui/core'

const ScrollArea = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    orientation?: 'horizontal' | 'vertical' | 'both'
    scrollBarClassName?: string
  }
>(({ className, children, orientation = 'vertical', scrollBarClassName, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="scroll-area"
    className={cn('relative overflow-hidden', className)}
    {...props}
  >
    <div
      data-slot="scroll-viewport"
      className={cn(
        'h-full w-full rounded-[inherit]',
        orientation === 'vertical' && 'overflow-y-auto overflow-x-hidden',
        orientation === 'horizontal' && 'overflow-x-auto overflow-y-hidden',
        orientation === 'both' && 'overflow-auto',
        'scrollbar-width-thin scrollbar-color-border scrollbar-track-transparent [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent',
        scrollBarClassName
      )}
    >
      {children}
    </div>
  </div>
))
ScrollArea.displayName = 'ScrollArea'

// Mock ScrollBar component for API compatibility
const ScrollBar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { orientation?: 'vertical' | 'horizontal' }
>(
  ({ className, orientation = 'vertical', ...props }, ref) => null // Native scroll doesn't need a separate scrollbar element usually unless specialized
)
ScrollBar.displayName = 'ScrollBar'

export { ScrollArea, ScrollBar }
