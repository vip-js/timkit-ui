'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { cva } from '../lib/cva'
import { cn } from '../lib/utils'
import * as hoverCard from '@zag-js/hover-card'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'
import type { Placement, PositioningOptions } from '@zag-js/popper'
import { Slot } from './slot'
import { createContext } from '../lib/create-context'
import { Presence } from '../lib/presence'

const hoverCardContentVariants = cva(
    'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none'
)

export const [HoverCardProvider, useHoverCard] = createContext<{
    api: hoverCard.Api
}>({
    name: 'HoverCardContext',
    hookName: 'useHoverCard',
    providerName: '<HoverCard />',
})

const HoverCard = ({
    children,
    open,
    defaultOpen,
    onOpenChange,
    openDelay = 600,
    closeDelay = 300,
    positioning,
    id,
    disabled,
}: {
    children: React.ReactNode
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
    openDelay?: number
    closeDelay?: number
    positioning?: PositioningOptions
    id?: string
    disabled?: boolean
}) => {
    const generatedId = React.useId()
    const service: hoverCard.Service = useMachine(hoverCard.machine, {
        id: id ?? generatedId,
        open,
        defaultOpen,
        openDelay,
        closeDelay,
        positioning,
        onOpenChange: (details) => onOpenChange?.(details.open),
    })
    const api = hoverCard.connect(service, normalizeProps)

    return <HoverCardProvider value={{ api }}>{children}</HoverCardProvider>
}
HoverCard.displayName = "HoverCard"

const HoverCardTrigger = React.forwardRef<
    HTMLAnchorElement,
    React.AnchorHTMLAttributes<HTMLAnchorElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
    const { api } = useHoverCard()

    const Comp = asChild ? Slot : "a"
    const triggerProps = api.getTriggerProps()
    const mergedProps = mergeProps(triggerProps, props)

    return (
        <Comp
            ref={ref}
            data-slot="hover-card-trigger"
            className={cn("cursor-pointer", className)}
            {...mergedProps}
        />
    )
})
HoverCardTrigger.displayName = "HoverCardTrigger"

const HoverCardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        align?: "center" | "start" | "end"
        side?: "top" | "bottom" | "left" | "right"
        sideOffset?: number
        showArrow?: boolean
    }
>(({ className, align = "center", side = "bottom", sideOffset = 4, showArrow = false, style, children, ...props }, ref) => {
    const { api } = useHoverCard()
    const placement = (align === "center" ? side : `${side}-${align}`) as Placement
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
                data-slot="hover-card-content"
                data-state={api.open ? "open" : "closed"}
                style={{ ...mergedProps.style, ...style }}
                className={cn(hoverCardContentVariants(), showArrow ? "relative" : undefined, className)}
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
        </Presence>,
        document.body
    )
})
HoverCardContent.displayName = "HoverCardContent"

export { HoverCard, HoverCardContent, HoverCardTrigger }
