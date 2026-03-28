import * as React from 'react'
import { dialogConnect, dialogMachine, type SheetProps } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/react'

export interface UseSheetProps extends SheetProps {
  id?: string
}

export function useSheet(props: UseSheetProps) {
  const generatedId = React.useId()
  const service = useMachine(dialogMachine, {
    id: props.id ?? generatedId,
    open: props.open,
    defaultOpen: props.defaultOpen,
    modal: props.modal,
    onOpenChange(details) {
      props.onOpenChange?.(details.open)
    },
  })

  return React.useMemo(
    () => dialogConnect(service as Parameters<typeof dialogConnect>[0], normalizeProps),
    [service]
  )
}
