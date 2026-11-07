import * as React from 'react'
import { createTimEvent, dialogConnect, dialogMachine } from '@timui/core'
import type { DialogProps as CoreDialogProps } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/react'

export interface UseDialogProps extends Omit<CoreDialogProps, 'id'> {
  id?: string
  defaultOpen?: boolean
  role?: 'dialog' | 'alertdialog'
}

export function useDialog(props: UseDialogProps = {}) {
  const generatedId = React.useId()
  const dialogId = props.id ?? `dialog-${generatedId}`

  const controlled = props.open !== undefined
  const service = useMachine(dialogMachine, {
    id: dialogId,
    ...(controlled ? { open: props.open === true } : { defaultOpen: props.defaultOpen }),
    modal: props.modal !== false,
    role: props.role,
    onOpenChange: (details) => {
      props.onOpenChange?.(createTimEvent('dialog.openChange', dialogId, { open: details.open }))
    },
  })

  const api = React.useMemo(() => dialogConnect(service, normalizeProps), [service])

  React.useEffect(() => {
    if (!api.open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      api.setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [api])

  React.useEffect(() => {
    if (props.open !== undefined && (props.open === true) !== api.open) {
      api.setOpen(props.open === true)
    }
  }, [props.open, api])

  return api
}
