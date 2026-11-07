import * as React from 'react'
import { tooltipConnect, tooltipMachine } from '@timui/core'
import type { PositioningOptions } from '@zag-js/popper'
import { normalizeProps, useMachine } from '@zag-js/react'

export interface UseTooltipProps {
  id?: string
  open?: boolean | null
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  openDelay?: number
  delayDuration?: number
  closeDelay?: number
  closeOnPointerDown?: boolean
  closeOnEscape?: boolean
  closeOnScroll?: boolean
  closeOnClick?: boolean
  interactive?: boolean
  positioning?: PositioningOptions
  disabled?: boolean
}

export function useTooltip(props: UseTooltipProps) {
  const generatedId = React.useId()
  const controlled = props.open !== undefined
  const service = useMachine(tooltipMachine, {
    id: props.id ?? generatedId,
    ...(controlled ? { open: props.open === true } : { defaultOpen: props.defaultOpen }),
    openDelay: props.delayDuration ?? props.openDelay,
    closeDelay: props.closeDelay,
    closeOnPointerDown: props.closeOnPointerDown,
    closeOnEscape: props.closeOnEscape,
    closeOnScroll: props.closeOnScroll,
    closeOnClick: props.closeOnClick,
    interactive: props.interactive,
    positioning: props.positioning,
    disabled: props.disabled,
    onOpenChange: (details) => props.onOpenChange?.(details.open),
  })

  return tooltipConnect(service, normalizeProps)
}
