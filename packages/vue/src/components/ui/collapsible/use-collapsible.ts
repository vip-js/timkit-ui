import { collapsibleConnect, collapsibleMachine } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, ref, useId, watchEffect } from 'vue'

import { usePassedProp } from '../../../hooks/passed-prop'

type CollapsibleProps = {
  id?: string
  open?: boolean | null
  defaultOpen?: boolean
  disabled?: boolean
  onOpenChange?: (open: boolean) => void
}

type CollapsibleEmit = {
  (event: 'update:open', open: boolean): void
  (event: 'change', open: boolean): void
}

export function useCollapsible(props: CollapsibleProps = {}, emit?: CollapsibleEmit) {
  const generatedId = useId()
  const passed = usePassedProp()
  const machineProps = computed(() => {
    const open = passed<boolean | null>(props, 'open')
    const defaultOpen = passed<boolean>(props, 'defaultOpen')
    return {
      id: props.id ?? generatedId,
      ...(open === undefined ? { defaultOpen } : { open: open === true }),
      disabled: props.disabled === true ? true : undefined,
      onOpenChange(details: { open: boolean }) {
        props.onOpenChange?.(details.open)
        emit?.('update:open', details.open)
        emit?.('change', details.open)
      },
    }
  })

  const service = useMachine(collapsibleMachine, machineProps)
  const initialOpen = passed<boolean | null>(props, 'open')
  const phase = ref(
    initialOpen === undefined ? (props.defaultOpen ? 'open' : 'closed') : initialOpen === true ? 'open' : 'closed'
  )
  watchEffect(() => {
    phase.value = service.state.matches('open') ? 'open' : service.state.matches('closing') ? 'closing' : 'closed'
  })

  return computed(() => {
    phase.value
    return collapsibleConnect(service, normalizeProps)
  })
}
