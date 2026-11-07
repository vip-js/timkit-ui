import { tooltipConnect, tooltipMachine } from '@timui/core'
import { usePassedProp } from '../../../hooks/passed-prop'
import type { PositioningOptions } from '@zag-js/popper'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, ref, useId, watch, watchEffect } from 'vue'

export interface UseTooltipProps {
  id?: string
  open?: boolean | null
  defaultOpen?: boolean
  openDelay?: number
  delayDuration?: number
  closeDelay?: number
  disabled?: boolean
  closeOnPointerDown?: boolean
  closeOnEscape?: boolean
  closeOnScroll?: boolean
  closeOnClick?: boolean
  interactive?: boolean
  positioning?: PositioningOptions
  onOpenChange?: (open: boolean) => void
}

export interface UseTooltipEmits {
  (e: 'update:open', value: boolean): void
  (e: 'change', value: boolean): void
}

export function useTooltip(props: UseTooltipProps, emit: UseTooltipEmits) {
  const generatedId = useId()
  const passed = usePassedProp()

  const machineProps = computed(() => {
    const open = passed<boolean | null>(props, 'open')
    return {
      id: props.id ?? generatedId,
      ...(open === undefined ? { defaultOpen: props.defaultOpen } : { open: open === true }),
      openDelay: props.delayDuration ?? props.openDelay,
      closeDelay: props.closeDelay,
      disabled: props.disabled,
      closeOnPointerDown: props.closeOnPointerDown,
      closeOnEscape: props.closeOnEscape,
      closeOnScroll: props.closeOnScroll,
      closeOnClick: props.closeOnClick,
      interactive: props.interactive,
      positioning: props.positioning,
      onOpenChange(details: { open: boolean }) {
        props.onOpenChange?.(details.open)
        emit('update:open', details.open)
        emit('change', details.open)
      },
    }
  })

  const service = useMachine(tooltipMachine, machineProps)
  const phase = ref('closed')
  watchEffect(() => {
    phase.value = service.state.matches('open', 'closing')
      ? 'open'
      : service.state.matches('opening')
        ? 'opening'
        : 'closed'
  })
  const api = computed(() => {
    phase.value
    return tooltipConnect(service, normalizeProps)
  })

  watch(
    () => props.open,
    (val?: boolean | null) => {
      if (val === undefined) return
      const next = val === true
      if (next !== api.value.open) api.value.setOpen(next)
    }
  )

  return api
}
