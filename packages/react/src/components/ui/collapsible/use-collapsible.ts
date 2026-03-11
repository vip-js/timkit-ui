import * as React from 'react'
import { collapsibleConnect, collapsibleMachine } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/react'

export interface UseCollapsibleProps {
  id?: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
}

export function useCollapsible(props: UseCollapsibleProps) {
  const generatedId = React.useId()
  const service = useMachine(collapsibleMachine, {
    id: props.id ?? generatedId,
    open: props.open,
    defaultOpen: props.defaultOpen,
    disabled: props.disabled,
    onOpenChange(details) {
      props.onOpenChange?.(details.open)
    },
  })

  return React.useMemo(() => collapsibleConnect(service, normalizeProps), [service])
}
