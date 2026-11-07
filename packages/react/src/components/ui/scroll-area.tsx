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

const scrollAxis = (orientation: 'horizontal' | 'vertical' | 'both') =>
  orientation === 'horizontal'
    ? { overflowX: 'auto' as const, overflowY: 'hidden' as const }
    : orientation === 'both'
      ? { overflowX: 'auto' as const, overflowY: 'auto' as const }
      : { overflowX: 'hidden' as const, overflowY: 'auto' as const }

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  (
    { className, children, orientation = 'vertical', scrollBarClassName, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, ...props },
    ref
  ) => (
    <div
      ref={ref}
      {...props}
      data-slot="scroll-area"
      data-orientation={orientation}
      className={cn(scrollAreaVariants(), className)}
    >
      {orientation === 'both' ? (
        <p role="status">Both</p>
      ) : orientation === 'horizontal' ? (
        <p role="status">Horizontal</p>
      ) : (
        <p role="status">Vertical</p>
      )}
      <div
        data-slot="scroll-viewport"
        data-orientation={orientation}
        aria-labelledby={ariaLabelledBy}
        aria-label={
          ariaLabelledBy ? undefined : typeof ariaLabel === 'string' && ariaLabel ? ariaLabel : 'Scroll area'
        }
        style={scrollAxis(orientation)}
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
