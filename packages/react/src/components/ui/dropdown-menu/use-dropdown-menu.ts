import * as React from 'react'
import { menuMachine, menuConnect } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/react'
import type { PositioningOptions } from '@zag-js/popper'

export type DropdownMenuProps = {
    id?: string
    open?: boolean
    defaultOpen?: boolean
    closeOnSelect?: boolean
    loopFocus?: boolean
    positioning?: PositioningOptions
    onOpenChange?: (open: boolean) => void
    children?: React.ReactNode
}

export function useDropdownMenu(props: DropdownMenuProps) {
    const { onOpenChange, ...menuProps } = props
    const generatedId = React.useId()
    const service = useMachine(menuMachine, {
        id: menuProps.id ?? generatedId,
        open: menuProps.open,
        defaultOpen: menuProps.defaultOpen,
        closeOnSelect: menuProps.closeOnSelect,
        loopFocus: menuProps.loopFocus,
        positioning: menuProps.positioning,
        onOpenChange: (details: { open: boolean }) => onOpenChange?.(details.open),
    })
    return menuConnect(service, normalizeProps)
}
