import type * as dialog from '@zag-js/dialog'
import type { TimEvent, LogicDefinition } from '../../shared'

export type DialogOpenChangeEvent = TimEvent<{ open: boolean }>

export type DialogProps = Omit<dialog.Props, 'onOpenChange'> & {
    onOpenChange?: (event: DialogOpenChangeEvent) => void
}

export type DialogVueProps = {
    id?: string
    open?: boolean
    defaultOpen?: boolean
    modal?: boolean
    onOpenChange?: (details: { open: boolean }) => void
}

/**
 * Dialog Logic Definition契约
 */
export type DialogLogic = LogicDefinition<DialogProps, dialog.Api>
