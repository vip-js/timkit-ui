import * as React from 'react'
import { dialogConnect, dialogMachine, type SheetProps } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/react'

export interface UseSheetProps extends SheetProps {
  id?: string
}

export function useSheet(props: UseSheetProps) {
  const generatedId = React.useId()
  const controlled = props.open !== undefined
  const service = useMachine(dialogMachine, {
    id: props.id ?? generatedId,
    ...(controlled ? { open: props.open === true } : { defaultOpen: props.defaultOpen }),
    modal: props.modal,
    onOpenChange(details) {
      props.onOpenChange?.(details.open)
    },
  })

  const api = React.useMemo(
    () => dialogConnect(service as Parameters<typeof dialogConnect>[0], normalizeProps),
    [service]
  )

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

  return api
}
