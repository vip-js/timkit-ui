'use client'

import * as React from 'react'
import { cn, hoverCardMachine } from '@timui/core'
import { createPortal } from 'react-dom'

import { useMachine } from '../hooks/use-machine'
import { Slot } from './slot'

const HoverCardContext = React.createContext<{
  state: any
  send: (event: any) => void
  triggerRef: React.RefObject<HTMLAnchorElement | null> // Usually anchor/button
} | null>(null)

function useHoverCard() {
  const context = React.useContext(HoverCardContext)
  if (!context) {
    throw new Error('HoverCard components must be used within HoverCard')
  }
  return context
}

const HoverCard = ({
  children,
  open,
  defaultOpen,
  onOpenChange,
  openDelay = 700,
  closeDelay = 300,
}: {
  children: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  openDelay?: number
  closeDelay?: number
}) => {
  const initialOpen = open !== undefined ? open : defaultOpen
  const triggerRef = React.useRef<HTMLAnchorElement>(null)

  const [state, send] = useMachine(hoverCardMachine, {
    context: {
      open: initialOpen !== undefined ? initialOpen : false,
      openDelay,
      closeDelay,
    },
  })

  // External sync
  React.useEffect(() => {
    if (open !== undefined && open !== state.context.open) {
      if (open) send({ type: 'OPEN' })
      else send({ type: 'CLOSE' })
    }
  }, [open, send, state.context.open])

  // Delays handled via timeout refs if not in machine?
  // Machine actions "open" / "close" are instant in our dummy machine.
  // We should implement delay logic in React for this migration if machine is simple.

  const openTimeout = React.useRef<any>(undefined)
  const closeTimeout = React.useRef<any>(undefined)

  const handleOpen = () => {
    clearTimeout(closeTimeout.current)
    openTimeout.current = setTimeout(() => {
      send({ type: 'OPEN' })
      onOpenChange?.(true)
    }, openDelay)
  }

  const handleClose = () => {
    clearTimeout(openTimeout.current)
    closeTimeout.current = setTimeout(() => {
      send({ type: 'CLOSE' })
      onOpenChange?.(false)
    }, closeDelay)
  }

  const contextValue = React.useMemo(
    () => ({
      state,
      send: (evt: any) => {
        if (evt.type === 'OPEN_DELAY') handleOpen()
        else if (evt.type === 'CLOSE_DELAY') handleClose()
        else send(evt)
      },
      triggerRef,
    }),
    [state, send, openDelay, closeDelay]
  ) // Deps stable enough

  return <HoverCardContext.Provider value={contextValue}>{children}</HoverCardContext.Provider>
}
HoverCard.displayName = 'HoverCard'

const HoverCardTrigger = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const { send, triggerRef } = useHoverCard()

  const mergedRef = React.useCallback(
    (node: HTMLAnchorElement) => {
      // @ts-ignore
      triggerRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) (ref as any).current = node
    },
    [ref, triggerRef]
  )

  const Comp = asChild ? Slot : 'a'

  return (
    <Comp
      ref={mergedRef}
      data-slot="hover-card-trigger"
      onMouseEnter={() => send({ type: 'OPEN_DELAY' })}
      onMouseLeave={() => send({ type: 'CLOSE_DELAY' })}
      onFocus={() => send({ type: 'OPEN_DELAY' })} // Focus usually instant? HoverCard spec varies.
      onBlur={() => send({ type: 'CLOSE_DELAY' })}
      className={cn('cursor-pointer', className)}
      {...props}
    />
  )
})
HoverCardTrigger.displayName = 'HoverCardTrigger'

const HoverCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    align?: 'center'
    sideOffset?: number
    showArrow?: boolean
  }
>(
  (
    { className, align = 'center', sideOffset = 4, showArrow = false, style, children, ...props },
    ref
  ) => {
    void align
    const { state, triggerRef, send } = useHoverCard()
    const isOpen = state.context.open

    const [coords, setCoords] = React.useState({ top: 0, left: 0 })

    React.useLayoutEffect(() => {
      if (isOpen && triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect()
        setCoords({
          top: rect.bottom + window.scrollY + sideOffset,
          left: rect.left + window.scrollX,
        })
      }
    }, [isOpen, sideOffset, triggerRef])

    if (!isOpen) return null
    if (typeof window === 'undefined') return null

    return createPortal(
      <div
        ref={ref}
        data-slot="hover-card-content"
        data-state="open"
        style={{
          position: 'absolute',
          top: coords.top,
          left: coords.left,
          ...style,
        }}
        onMouseEnter={() => send({ type: 'OPEN_DELAY' })} // Keep open if hovering content
        onMouseLeave={() => send({ type: 'CLOSE_DELAY' })}
        className={cn(
          'relative z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          className
        )}
        {...props}
      >
        {children}
        {showArrow ? (
          <span
            data-slot="hover-card-arrow"
            className="absolute -top-1 left-6 h-2 w-2 rotate-45 border border-border bg-popover"
          />
        ) : null}
      </div>,
      document.body
    )
  }
)
HoverCardContent.displayName = 'HoverCardContent'

export { HoverCard, HoverCardContent, HoverCardTrigger }
