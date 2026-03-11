'use client'

import * as React from 'react'
import type { AssertNoExtraKeys, ScrollAreaProps as CoreScrollAreaProps } from '@timui/core'
import { cn, scrollAreaVariants, scrollAreaViewportVariants } from '@timui/core'

type ScrollAreaProps = CoreScrollAreaProps &
  React.HTMLAttributes<HTMLDivElement> & { scrollBarClassName?: string }
type _ScrollAreaPropsGuard = AssertNoExtraKeys<
  ScrollAreaProps,
  CoreScrollAreaProps & React.HTMLAttributes<HTMLDivElement> & { scrollBarClassName?: string }
>

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, children, orientation = 'vertical', scrollBarClassName, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="scroll-area"
      className={cn(scrollAreaVariants(), className)}
      {...props}
    >
      <div
        data-slot="scroll-viewport"
        className={cn(scrollAreaViewportVariants(), scrollBarClassName)}
      >
        {children}
      </div>
    </div>
  )
)
ScrollArea.displayName = 'ScrollArea'

// Mock ScrollBar component for API compatibility
const ScrollBar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { orientation?: 'vertical' | 'horizontal' }
>(
  ({ className, orientation = 'vertical', ...props }, ref) =>
    null // Native scroll doesn't need a separate scrollbar element usually unless specialized
)
ScrollBar.displayName = 'ScrollBar'

export { ScrollArea, ScrollBar }
