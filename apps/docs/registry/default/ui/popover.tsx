'use client'

import * as React from 'react'
import { cn, popoverConnect, popoverContentVariants, popoverMachine } from '@timui/core'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'
import { createPortal } from 'react-dom'

import { Slot } from './slot'

type Placement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end'

const PopoverContext = React.createContext<{
  api: ReturnType<typeof popoverConnect>
} | null>(null)

function usePopover() {
  const context = React.useContext(PopoverContext)
  if (!context) {
    throw new Error('Popover components must be used within Popover')
  }
  return context
}

const Popover = ({
  children,
  open,
  defaultOpen,
  onOpenChange,
  modal = false,
  ids,
}: {
  children: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  modal?: boolean
  ids?: {
    anchor?: string
    trigger?: string
    content?: string
    title?: string
    description?: string
    closeTrigger?: string
    positioner?: string
    arrow?: string
  }
}) => {
  const service = useMachine(popoverMachine, {
    id: React.useId(),
    open,
    defaultOpen,
    modal,
    ids,
    onOpenChange: (details) => onOpenChange?.(details.open),
  })

  const api = React.useMemo(() => popoverConnect(service, normalizeProps), [service])

  return <PopoverContext.Provider value={{ api }}>{children}</PopoverContext.Provider>
}
Popover.displayName = 'Popover'

const PopoverTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, onClick, asChild = false, children, ...props }, ref) => {
  const { api } = usePopover()

  const Comp = asChild ? Slot : 'button'
  const triggerProps = api.getTriggerProps()
  const mergedProps = mergeProps(triggerProps, props)

  if (asChild) {
    return (
      <Comp ref={ref} data-slot="popover-trigger" className={cn(className)} {...mergedProps}>
        {children}
      </Comp>
    )
  }

  return (
    <Comp
      ref={ref}
      type="button"
      data-slot="popover-trigger"
      className={cn(className)}
      {...mergedProps}
    >
      {children}
    </Comp>
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
    const { api } = usePopover()
    const isOpen = api.open

    const placement = (align === 'center' ? side : `${side}-${align}`) as Placement
    React.useLayoutEffect(() => {
      if (!api.open || typeof window === 'undefined') return
      api.reposition({ placement, gutter: sideOffset })
    }, [api, placement, sideOffset])

    if (!isOpen) return null
    if (typeof window === 'undefined') return null

    const positionerProps = api.getPositionerProps()
    const contentProps = api.getContentProps()
    const mergedProps = mergeProps(contentProps, props)

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

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }

const PopoverAnchor = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => <div ref={ref} {...props} />
)
PopoverAnchor.displayName = 'PopoverAnchor'
