'use client'

import * as React from 'react'
import * as popover from '@zag-js/popover'
import type { Placement, PositioningOptions } from '@zag-js/popper'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'
import { createPortal } from 'react-dom'

import { createContext } from '../lib/create-context'
import { cva } from '../lib/cva'
import { Presence } from '../lib/presence'
import { cn } from '../lib/utils'
import { Slot } from './slot'

const popoverContentVariants = cva(
  'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[2px] data-[state=open]:slide-in-from-top-[2px] z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none'
)

export const [PopoverProvider, usePopover] = createContext<{
  api: popover.Api
}>({
  name: 'PopoverContext',
  hookName: 'usePopover',
  providerName: '<Popover />',
})

const Popover = ({
  children,
  open,
  defaultOpen,
  onOpenChange,
  modal = false,
  positioning,
  closeOnInteractOutside,
  closeOnEscape,
  id,
}: {
  children: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  modal?: boolean
  positioning?: PositioningOptions
  closeOnInteractOutside?: boolean
  closeOnEscape?: boolean
  id?: string
}) => {
  const generatedId = React.useId()
  const service: popover.Service = useMachine(popover.machine, {
    id: id ?? generatedId,
    open,
    defaultOpen,
    modal,
    positioning,
    closeOnInteractOutside,
    closeOnEscape,
    onOpenChange: (details) => onOpenChange?.(details.open),
  })
  const api = popover.connect(service, normalizeProps)

  return <PopoverProvider value={{ api }}>{children}</PopoverProvider>
}
Popover.displayName = 'Popover'

const PopoverTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, onClick, asChild = false, ...props }, ref) => {
  const { api } = usePopover()

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
    const { api } = usePopover()
    const placement = (align === 'center' ? side : `${side}-${align}`) as Placement
    React.useEffect(() => {
      if (!api.open) return
      api.reposition({ placement, gutter: sideOffset })
    }, [api, placement, sideOffset])
    if (typeof window === 'undefined') return null

    const positionerProps = api.getPositionerProps()
    const contentProps = api.getContentProps()
    const mergedProps = mergeProps(contentProps, props)

    return createPortal(
      <Presence
        present={api.open}
        lazyMount
        unmountOnExit
        {...positionerProps}
        style={{ ...positionerProps.style, zIndex: 50 }}
      >
        <div
          ref={ref}
          data-slot="popover-content"
          data-state={api.open ? 'open' : 'closed'}
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
      </Presence>,
      document.body
    )
  }
)
PopoverContent.displayName = 'PopoverContent'

export { Popover, PopoverTrigger, PopoverContent }
