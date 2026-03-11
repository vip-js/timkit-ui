'use client'

import * as React from 'react'
import { cn, hoverCardContentVariants } from '@timui/core'
import type { Placement } from '@zag-js/popper'
import { mergeProps } from '@zag-js/react'
import { createPortal } from 'react-dom'

import { useHoverCard, type UseHoverCardProps } from './hover-card/use-hover-card'
import { HoverCardProvider, useHoverCardContext } from './hover-card/use-hover-card-context'
import { Slot } from './slot'

const HoverCard = ({ children, ...props }: UseHoverCardProps & { children: React.ReactNode }) => {
  const api = useHoverCard(props)
  return <HoverCardProvider value={api}>{children}</HoverCardProvider>
}
HoverCard.displayName = 'HoverCard'

const HoverCardTrigger = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const api = useHoverCardContext()

  const Comp = asChild ? Slot : 'a'
  const triggerProps = api.getTriggerProps()
  const mergedProps = mergeProps(triggerProps, props)

  return (
    <Comp
      ref={ref}
      data-slot="hover-card-trigger"
      className={cn('cursor-pointer', className)}
      {...mergedProps}
    />
  )
})
HoverCardTrigger.displayName = 'HoverCardTrigger'

const HoverCardContent = React.forwardRef<
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
    const api = useHoverCardContext()
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
          data-slot="hover-card-content"
          data-state="open"
          style={{ ...mergedProps.style, ...style }}
          className={cn(hoverCardContentVariants(), showArrow ? 'relative' : undefined, className)}
          {...mergedProps}
        >
          {children}
          {showArrow ? (
            <span
              data-slot="hover-card-arrow"
              className="absolute -top-1 left-6 h-2 w-2 rotate-45 border border-border bg-popover"
            />
          ) : null}
        </div>
      </div>,
      document.body
    )
  }
)
HoverCardContent.displayName = 'HoverCardContent'

export { HoverCard, HoverCardContent, HoverCardTrigger }
