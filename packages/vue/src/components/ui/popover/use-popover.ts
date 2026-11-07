import { popoverConnect, popoverMachine } from '@timui/core'
import { usePassedProp } from '../../../hooks/passed-prop'
import type { PositioningOptions } from '@zag-js/popper'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, ref, useId, watch, watchEffect } from 'vue'

export interface UsePopoverProps {
  id?: string
  open?: boolean | null
  defaultOpen?: boolean
  modal?: boolean
  closeOnInteractOutside?: boolean
  closeOnEscape?: boolean
  positioning?: PositioningOptions
  onOpenChange?: (open: boolean) => void
}

export interface UsePopoverEmits {
  (e: 'update:open', value: boolean): void
  (e: 'change', value: boolean): void
}

export function usePopover(props: UsePopoverProps, emit: UsePopoverEmits) {
  const generatedId = useId()
  const passed = usePassedProp()

  const machineProps = computed(() => {
    const open = passed<boolean | null>(props, 'open')
    return {
    id: props.id ?? generatedId,
    ...(open === undefined ? { defaultOpen: props.defaultOpen } : { open: open === true }),
    ...(passed<boolean>(props, 'modal') === undefined ? {} : { modal: props.modal === true }),
    closeOnInteractOutside: props.closeOnInteractOutside,
    closeOnEscape: props.closeOnEscape,
    positioning: props.positioning,
    onOpenChange(details: { open: boolean }) {
      props.onOpenChange?.(details.open)
      emit('update:open', details.open)
      emit('change', details.open)
    },
  }
  })

  const service = useMachine(popoverMachine, machineProps)
  const phase = ref('closed')
  watchEffect(() => {
    phase.value = service.state.matches('open') ? 'open' : 'closed'
  })
  const api = computed(() => {
    phase.value
    return popoverConnect(service, normalizeProps)
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
