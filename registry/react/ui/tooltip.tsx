'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { cva } from '../lib/cva'
import { cn } from '../lib/utils'
import * as tooltip from '@zag-js/tooltip'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'
import type { Placement, PositioningOptions } from '@zag-js/popper'
import { Slot } from './slot'
import { createContext } from '../lib/create-context'
import { Presence } from '../lib/presence'

const tooltipContentVariants = cva(
    'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md'
)

const [TooltipLocalProvider, useTooltip] = createContext<{
    api: tooltip.Api
}>({
    name: 'TooltipContext',
    hookName: 'useTooltip',
    providerName: '<Tooltip />',
})

const TooltipProvider = ({ children, delayDuration, skipDelayDuration, disableHoverableContent }: {
    children: React.ReactNode,
    delayDuration?: number,
    skipDelayDuration?: number,
    disableHoverableContent?: boolean
}) => {
    return <>{children}</>
}
const Tooltip = ({ children, open, defaultOpen, onOpenChange, openDelay, closeDelay, positioning, id, disabled }: {
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
    const service: tooltip.Service = useMachine(tooltip.machine, {
        id: id ?? generatedId,
        open,
        defaultOpen,
        openDelay,
        closeDelay,
        positioning,
        disabled,
        onOpenChange: (details) => onOpenChange?.(details.open),
    })
    const api = tooltip.connect(service, normalizeProps)

    return <TooltipLocalProvider value={{ api }}>{children}</TooltipLocalProvider>
}
Tooltip.displayName = "Tooltip"

const TooltipTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
    const { api } = useTooltip()
    const Comp = asChild ? Slot : "button"
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
TooltipTrigger.displayName = "TooltipTrigger"

const TooltipContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        sideOffset?: number
        side?: "top" | "bottom" | "left" | "right"
        showArrow?: boolean
    }
>(({ className, sideOffset = 4, side = "top", showArrow = false, style, children, ...props }, ref) => {
    const { api } = useTooltip()
    React.useEffect(() => {
        if (!api.open) return
        api.reposition({ placement: side as Placement, gutter: sideOffset })
    }, [api, side, sideOffset])
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
                data-slot="tooltip-content"
                data-state={api.open ? "open" : "closed"}
                style={{ ...mergedProps.style, ...style }}
                className={cn(tooltipContentVariants(), showArrow ? "relative" : undefined, className)}
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
        </Presence>,
        document.body
    )
})
TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
