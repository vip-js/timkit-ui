import { menuConnect, menuMachine } from '@timui/core'
import type { PositioningOptions } from '@zag-js/popper'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, ref, useId, watchEffect } from 'vue'

import { usePassedProp } from '../../../hooks/passed-prop'

type UseDropdownMenuProps = {
  id?: string
  open?: boolean | null
  defaultOpen?: boolean
  closeOnSelect?: boolean
  disabled?: boolean
  loopFocus?: boolean
  positioning?: PositioningOptions
  onOpenChange?: (open: boolean) => void
}

export function useDropdownMenu(
  props: UseDropdownMenuProps,
  emit: (event: 'update:open' | 'change', value: boolean) => void
) {
  const generatedId = useId()
  const passed = usePassedProp()

  const machineProps = computed(() => {
    const open = passed<boolean | null>(props, 'open')
    return {
    id: props.id ?? generatedId,
    ...(open === undefined ? { defaultOpen: props.defaultOpen } : { open: open === true }),
    closeOnSelect: props.closeOnSelect,
    disabled: props.disabled,
    loopFocus: props.loopFocus,
    positioning: props.positioning,
    onOpenChange(details: { open: boolean }) {
      props.onOpenChange?.(details.open)
      emit('update:open', details.open)
      emit('change', details.open)
    },
    }
  })

  const service = useMachine(menuMachine, machineProps)
  const phase = ref('')
  watchEffect(() => {
    phase.value = String(service.context.get('highlightedValue') ?? '')
  })
  const api = computed(() => {
    phase.value
    return menuConnect(service, normalizeProps)
  })

  return api
}
