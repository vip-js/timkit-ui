import * as React from 'react'
import { collapsibleConnect, collapsibleMachine } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/react'

export interface UseCollapsibleProps {
  id?: string
  open?: boolean | null
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
}

export function useCollapsible(props: UseCollapsibleProps) {
  const generatedId = React.useId()
  const controlled = props.open !== undefined
  const service = useMachine(collapsibleMachine, {
    id: props.id ?? generatedId,
    ...(controlled ? { open: props.open === true } : { defaultOpen: props.defaultOpen }),
    disabled: props.disabled,
    onOpenChange(details) {
      props.onOpenChange?.(details.open)
    },
  })

  return collapsibleConnect(service, normalizeProps)
}
