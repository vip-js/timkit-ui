'use client'

import * as React from 'react'
import { cn, popoverContentVariants } from '@timui/core'
import type { Placement } from '@zag-js/popper'
import { mergeProps } from '@zag-js/react'
import { createPortal } from 'react-dom'

import { usePopover, type UsePopoverProps } from './popover/use-popover'
import { PopoverProvider, usePopoverContext } from './popover/use-popover-context'
import { Slot } from './slot'

const Popover = ({ children, ...props }: UsePopoverProps & { children: React.ReactNode }) => {
  const api = usePopover(props)
  return <PopoverProvider value={api}>{children}</PopoverProvider>
}
Popover.displayName = 'Popover'

const PopoverTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, onClick, asChild = false, ...props }, ref) => {
  const api = usePopoverContext()

  const Comp = asChild ? Slot : 'button'
  const triggerProps = api.getTriggerProps()
  const mergedProps = mergeProps(triggerProps, props)

  return (
    <Comp
      ref={ref}
      data-slot="popover-trigger"
      type="button"
      className={cn(className)}
      {...mergedProps}
    />
  )
})
PopoverTrigger.displayName = 'PopoverTrigger'

const PopoverContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    align?: 'center' | 'start' | 'end'
    side?: 'top' | 'bottom' | 'left' | 'right'
    sideOffset?: number
    showArrow?: boolean
  }
>(
  (
    {
      className,
      align = 'center',
      side = 'bottom',
      sideOffset = 4,
      showArrow = false,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const api = usePopoverContext()
    const placement = (align === 'center' ? side : `${side}-${align}`) as Placement
    React.useEffect(() => {
      if (!api.open) return
      api.reposition({ placement, gutter: sideOffset })
    }, [api, placement, sideOffset])
    if (!api.open) return null
    if (typeof window === 'undefined') return null

    const positionerProps = api.getPositionerProps()
    const contentProps = api.getContentProps()
    const mergedProps = mergeProps(contentProps, props) as React.HTMLAttributes<HTMLDivElement>

    return createPortal(
      <div {...positionerProps} style={{ ...positionerProps.style, zIndex: 50 }}>
        <div
          ref={ref}
          data-slot="popover-content"
          data-state="open"
          data-align={align}
          style={{ ...mergedProps.style, ...style }}
          className={cn(popoverContentVariants(), showArrow ? 'relative' : undefined, className)}
          {...mergedProps}
        >
          {children}
          {showArrow ? (
            <span
              data-slot="popover-arrow"
              className="absolute -top-1 left-6 h-2 w-2 rotate-45 border border-border bg-popover"
            />
          ) : null}
        </div>
      </div>,
      document.body
    )
  }
)
PopoverContent.displayName = 'PopoverContent'

export { Popover, PopoverTrigger, PopoverContent }
