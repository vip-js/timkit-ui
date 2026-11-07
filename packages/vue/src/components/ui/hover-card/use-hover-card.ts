import { hoverCardConnect, hoverCardMachine } from '@timui/core'
import { usePassedProp } from '../../../hooks/passed-prop'
import type { PositioningOptions } from '@zag-js/popper'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, ref, useId, watch, watchEffect } from 'vue'

export interface UseHoverCardProps {
  id?: string
  open?: boolean | null
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
  const passed = usePassedProp()

  const machineProps = computed(() => {
    const open = passed<boolean | null>(props, 'open')
    const disabled = passed<boolean>(props, 'disabled')
    return {
      id: props.id ?? generatedId,
      ...(open === undefined ? { defaultOpen: passed<boolean>(props, 'defaultOpen') } : { open: open === true }),
      openDelay: props.openDelay,
      closeDelay: props.closeDelay,
      disabled: disabled === true,
      positioning: props.positioning,
      onOpenChange(details: { open: boolean }) {
        props.onOpenChange?.(details.open)
        emit('update:open', details.open)
        emit('change', details.open)
      },
    }
  })

  const service = useMachine(hoverCardMachine, machineProps)
  const phase = ref('closed')
  watchEffect(() => {
    phase.value = service.state.matches('open', 'closing') ? 'open' : 'closed'
  })
  const api = computed(() => {
    phase.value
    return hoverCardConnect(service, normalizeProps)
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
