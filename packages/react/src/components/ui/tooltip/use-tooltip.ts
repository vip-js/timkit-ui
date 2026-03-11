import * as React from 'react'
import { tooltipConnect, tooltipMachine } from '@timui/core'
import type { PositioningOptions } from '@zag-js/popper'
import { normalizeProps, useMachine } from '@zag-js/react'

export interface UseTooltipProps {
  id?: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  openDelay?: number
  closeDelay?: number
  positioning?: PositioningOptions
  disabled?: boolean
}

export function useTooltip(props: UseTooltipProps) {
  const generatedId = React.useId()
  const service = useMachine(tooltipMachine, {
    id: props.id ?? generatedId,
    open: props.open,
    defaultOpen: props.defaultOpen,
    openDelay: props.openDelay,
    closeDelay: props.closeDelay,
    positioning: props.positioning,
    disabled: props.disabled,
    onOpenChange: (details) => props.onOpenChange?.(details.open),
  })

  const api = React.useMemo(() => tooltipConnect(service, normalizeProps), [service])

  return api
}
