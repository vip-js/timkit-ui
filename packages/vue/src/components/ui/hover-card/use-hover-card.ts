import { hoverCardConnect, hoverCardMachine } from '@timui/core'
import type { PositioningOptions } from '@zag-js/popper'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, useId, watch } from 'vue'

export interface UseHoverCardProps {
  id?: string
  open?: boolean
  defaultOpen?: boolean
  openDelay?: number
  closeDelay?: number
  disabled?: boolean
  positioning?: PositioningOptions
  onOpenChange?: (open: boolean) => void
}

export interface UseHoverCardEmits {
  (e: 'update:open', value: boolean): void
  (e: 'change', value: boolean): void
}

export function useHoverCard(props: UseHoverCardProps, emit: UseHoverCardEmits) {
  const generatedId = useId()

  const machineProps = computed(() => ({
    id: props.id ?? generatedId,
    open: props.open,
    defaultOpen: props.open === undefined ? props.defaultOpen : undefined,
    openDelay: props.openDelay,
    closeDelay: props.closeDelay,
    disabled: props.disabled,
    positioning: props.positioning,
    onOpenChange(details: { open: boolean }) {
      props.onOpenChange?.(details.open)
      emit('update:open', details.open)
      emit('change', details.open)
    },
  }))

  const service = useMachine(hoverCardMachine, machineProps)
  const api = computed(() => hoverCardConnect(service, normalizeProps))

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
