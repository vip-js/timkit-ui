import * as React from 'react'
import { createTimEvent, dialogConnect, dialogMachine } from '@timui/core'
import type { AlertDialogProps as CoreAlertDialogProps } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/react'

export interface UseAlertDialogProps extends Omit<CoreAlertDialogProps, 'id'> {
  id?: string
  defaultOpen?: boolean
  disabled?: boolean
}

export function useAlertDialog(props: UseAlertDialogProps = {}) {
  const generatedId = React.useId()
  const dialogId = props.id ?? `alert-dialog-${generatedId}`

  const controlled = props.open !== undefined
  const service = useMachine(dialogMachine, {
    id: dialogId,
    ...(controlled ? { open: props.open === true } : { defaultOpen: props.defaultOpen ?? false }),
    modal: true,
    role: 'alertdialog',
    closeOnInteractOutside: false,
    onOpenChange: (details) => {
      props.onOpenChange?.(
        createTimEvent('alertDialog.openChange', dialogId, { open: details.open })
      )
    },
  })

  const disabled = props.disabled === true
  const api = { ...dialogConnect(service, normalizeProps), disabled }

  React.useEffect(() => {
    if (props.open !== undefined && (props.open === true) !== api.open) {
      api.setOpen(props.open === true)
    }
  }, [props.open, api])

  return api
}
