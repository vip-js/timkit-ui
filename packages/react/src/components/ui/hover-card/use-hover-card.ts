import * as React from 'react'
import { hoverCardConnect, hoverCardMachine } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/react'
import type { PositioningOptions } from '@zag-js/popper'

export interface UseHoverCardProps {
    id?: string
    open?: boolean
    defaultOpen?: boolean
    openDelay?: number
    closeDelay?: number
    disabled?: boolean
    positioning?: PositioningOptions
    onOpenChange?: (open: boolean) => void
}

export function useHoverCard(props: UseHoverCardProps) {
    const generatedId = React.useId()
    const service = useMachine(hoverCardMachine, {
        id: props.id ?? generatedId,
        open: props.open,
        defaultOpen: props.defaultOpen,
        openDelay: props.openDelay,
        closeDelay: props.closeDelay,
        positioning: props.positioning,
        disabled: props.disabled,
        onOpenChange: (details) => props.onOpenChange?.(details.open),
    })

    const api = React.useMemo(() => hoverCardConnect(service, normalizeProps), [service])

    return api
}
