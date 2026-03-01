'use client'

import * as React from 'react'
import { cn, tooltipMachine } from '@timui/core'
import { createPortal } from 'react-dom'

import { useMachine } from '../hooks/use-machine'
import { Slot } from './slot'

const TooltipContext = React.createContext<{
  state: any
  send: (event: any) => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
} | null>(null)

function useTooltip() {
  const context = React.useContext(TooltipContext)
  if (!context) {
    throw new Error('Tooltip components must be used within Tooltip')
  }
  return context
}

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

const Tooltip = ({
  children,
  open,
  defaultOpen,
  onOpenChange,
}: {
  children: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}) => {
  const initialOpen = open !== undefined ? open : defaultOpen
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  const [state, send] = useMachine(tooltipMachine, {
    context: {
      open: initialOpen !== undefined ? initialOpen : false,
    },
  })

  React.useEffect(() => {
    if (open !== undefined && open !== state.context.open) {
      send({ type: 'OPEN.SET', open }) // Need to add OPEN.SET to tooltip machine if missing
    }
  }, [open, send, state.context.open])

  const contextValue = React.useMemo(
    () => ({
      state,
      send: (evt: any) => {
        send(evt)
      },
      triggerRef,
    }),
    [state, send]
  )

  const prevOpen = React.useRef(state.context.open)
  React.useEffect(() => {
    if (prevOpen.current !== state.context.open) {
      onOpenChange?.(state.context.open)
      prevOpen.current = state.context.open
    }
  }, [state.context.open, onOpenChange])

  return <TooltipContext.Provider value={contextValue}>{children}</TooltipContext.Provider>
}
Tooltip.displayName = 'Tooltip'

const TooltipTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const { send, triggerRef } = useTooltip()
  const Comp = asChild ? Slot : 'button'

  const mergedRef = React.useCallback(
    (node: HTMLButtonElement) => {
      // @ts-ignore
      triggerRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) (ref as any).current = node
    },
    [ref, triggerRef]
  )

  return (
    <Comp
      ref={mergedRef}
      data-slot="tooltip-trigger"
      type="button"
      onMouseEnter={() => send({ type: 'OPEN' })}
      onMouseLeave={() => send({ type: 'CLOSE' })}
      onFocus={() => send({ type: 'OPEN' })}
      onBlur={() => send({ type: 'CLOSE' })}
      className={cn(className)}
      {...props}
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
    { className, sideOffset = 4, side: _side, showArrow = false, style, children, ...props },
    ref
  ) => {
    void _side
    const { state, triggerRef } = useTooltip()
    const isOpen = state.context.open

    // Simple anchoring (Top-center or auto)
    // Simplified positioning logic
    const [coords, setCoords] = React.useState({ top: 0, left: 0 })

    React.useLayoutEffect(() => {
      if (isOpen && triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect()
        setCoords({
          top: rect.top + window.scrollY - sideOffset - 30, // Default to top
          left: rect.left + window.scrollX + rect.width / 2 - 0, // Center roughly?
        })
      }
    }, [isOpen, sideOffset, triggerRef])

    if (!isOpen) return null
    if (typeof window === 'undefined') return null

    return createPortal(
      <div
        ref={ref}
        data-slot="tooltip-content"
        data-state="open"
        style={{
          position: 'absolute',
          top: coords.top,
          left: coords.left,
          ...style,
        }}
        // Basic tooltips are non-interactive usually.
        className={cn(
          'relative z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          className
        )}
        {...props}
      >
        {children}
        {showArrow ? (
          <span
            data-slot="tooltip-arrow"
            className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border border-border bg-popover"
          />
        ) : null}
      </div>,
      document.body
    )
  }
)
TooltipContent.displayName = 'TooltipContent'

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
