import { tooltipConnect, tooltipMachine } from '@timui/core'
import type { PositioningOptions } from '@zag-js/popper'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, useId, watch } from 'vue'

export interface UseTooltipProps {
  id?: string
  open?: boolean
  defaultOpen?: boolean
  openDelay?: number
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

  const machineProps = computed(() => ({
    id: props.id ?? generatedId,
    open: props.open,
    defaultOpen: props.open === undefined ? props.defaultOpen : undefined,
    openDelay: props.openDelay,
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
  }))

  const service = useMachine(tooltipMachine, machineProps)
  const api = computed(() => tooltipConnect(service, normalizeProps))

  watch(
    () => props.open,
    (val?: boolean) => {
      if (val !== undefined && val !== api.value.open) {
        api.value.setOpen(val)
      }
    }
  )

  return api
}
