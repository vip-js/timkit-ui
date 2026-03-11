'use client'

import * as React from 'react'
import { cn, tooltipContentVariants } from '@timui/core'
import type { Placement } from '@zag-js/popper'
import { mergeProps } from '@zag-js/react'
import { createPortal } from 'react-dom'

import { Slot } from './slot'
import { useTooltip, type UseTooltipProps } from './tooltip/use-tooltip'
import { TooltipContextProvider, useTooltipContext } from './tooltip/use-tooltip-context'

const TooltipProvider = ({
  children,
  delayDuration,
  skipDelayDuration,
  disableHoverableContent,
}: {
  children: React.ReactNode
  delayDuration?: number
  skipDelayDuration?: number
  disableHoverableContent?: boolean
}) => {
  // Ideally coordinates delayGroups. For now, pass through.
  return <>{children}</>
}
const Tooltip = ({ children, ...props }: UseTooltipProps & { children: React.ReactNode }) => {
  const api = useTooltip(props)
  return <TooltipContextProvider value={api}>{children}</TooltipContextProvider>
}
Tooltip.displayName = 'Tooltip'

const TooltipTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const api = useTooltipContext()
  const Comp = asChild ? Slot : 'button'
  const triggerProps = api.getTriggerProps()
  const mergedProps = mergeProps(triggerProps, props)

  return (
    <Comp
      ref={ref}
      data-slot="tooltip-trigger"
      type="button"
      className={cn(className)}
      {...mergedProps}
    />
  )
})
TooltipTrigger.displayName = 'TooltipTrigger'

const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    sideOffset?: number
    side?: 'top' | 'bottom' | 'left' | 'right'
    showArrow?: boolean
  }
>(
  (
    { className, sideOffset = 4, side = 'top', showArrow = false, style, children, ...props },
    ref
  ) => {
    const api = useTooltipContext()
    React.useEffect(() => {
      if (!api.open) return
      api.reposition({ placement: side as Placement, gutter: sideOffset })
    }, [api, side, sideOffset])
    if (!api.open) return null
    if (typeof window === 'undefined') return null

    const positionerProps = api.getPositionerProps()
    const contentProps = api.getContentProps()
    const mergedProps = mergeProps(contentProps, props) as React.HTMLAttributes<HTMLDivElement>

    return createPortal(
      <div {...positionerProps} style={{ ...positionerProps.style, zIndex: 50 }}>
        <div
          ref={ref}
          data-slot="tooltip-content"
          data-state="open"
          style={{ ...mergedProps.style, ...style }}
          className={cn(tooltipContentVariants(), showArrow ? 'relative' : undefined, className)}
          {...mergedProps}
        >
          {children}
          {showArrow ? (
            <span
              data-slot="tooltip-arrow"
              className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border border-border bg-popover"
            />
          ) : null}
        </div>
      </div>,
      document.body
    )
  }
)
TooltipContent.displayName = 'TooltipContent'

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
