import * as React from 'react'
import { createTimEvent, dialogConnect, dialogMachine } from '@timui/core'
import type { AlertDialogProps as CoreAlertDialogProps } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/react'

export interface UseAlertDialogProps extends Omit<CoreAlertDialogProps, 'id'> {
  id?: string
  defaultOpen?: boolean
}

export function useAlertDialog(props: UseAlertDialogProps = {}) {
  const generatedId = React.useId()
  const dialogId = props.id ?? `alert-dialog-${generatedId}`

  const service = useMachine(dialogMachine, {
    id: dialogId,
    open: props.open,
    defaultOpen: props.defaultOpen ?? false,
    modal: true,
    role: 'alertdialog',
    onOpenChange: (details) => {
      props.onOpenChange?.(
        createTimEvent('alertDialog.openChange', dialogId, { open: details.open })
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
