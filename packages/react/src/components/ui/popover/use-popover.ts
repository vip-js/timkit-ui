import * as React from 'react'
import { popoverConnect, popoverMachine } from '@timui/core'
import type { PositioningOptions } from '@zag-js/popper'
import { normalizeProps, useMachine } from '@zag-js/react'

export interface UsePopoverProps {
  id?: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  modal?: boolean
  positioning?: PositioningOptions
  closeOnInteractOutside?: boolean
  closeOnEscape?: boolean
}

export function usePopover(props: UsePopoverProps) {
  const generatedId = React.useId()
  const service = useMachine(popoverMachine, {
    id: props.id ?? generatedId,
    open: props.open,
    defaultOpen: props.defaultOpen,
    modal: props.modal,
    positioning: props.positioning,
    closeOnInteractOutside: props.closeOnInteractOutside,
    closeOnEscape: props.closeOnEscape,
    onOpenChange: (details) => props.onOpenChange?.(details.open),
  })

  const api = React.useMemo(() => popoverConnect(service, normalizeProps), [service])

  return api
}
