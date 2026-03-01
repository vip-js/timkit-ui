import * as React from 'react'
import { dialogMachine, createTimEvent, dialogConnect } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/react'
import type { DialogProps as CoreDialogProps } from '@timui/core'

export interface UseDialogProps extends Omit<CoreDialogProps, 'id'> {
    id?: string
    defaultOpen?: boolean
    role?: 'dialog' | 'alertdialog'
}

export function useDialog(props: UseDialogProps = {}) {
    const generatedId = React.useId()
    const dialogId = props.id ?? `dialog-${generatedId}`

    const service = useMachine(dialogMachine, {
        id: dialogId,
        open: props.open,
        defaultOpen: props.defaultOpen,
        modal: props.modal !== false,
        role: props.role,
        onOpenChange: (details) => {
            props.onOpenChange?.(
                createTimEvent('dialog.openChange', dialogId, { open: details.open })
            )
        },
    })

    const api = React.useMemo(() => dialogConnect(service, normalizeProps), [service])

    React.useEffect(() => {
        if (props.open !== undefined && props.open !== api.open) {
            api.setOpen(props.open)
        }
    }, [props.open, api])

    return api
}
