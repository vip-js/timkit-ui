import { menuConnect, menuMachine } from '@timui/core'
import type { PositioningOptions } from '@zag-js/popper'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, useId } from 'vue'

type UseDropdownMenuProps = {
  id?: string
  open?: boolean
  defaultOpen?: boolean
  closeOnSelect?: boolean
  loopFocus?: boolean
  positioning?: PositioningOptions
  onOpenChange?: (open: boolean) => void
}

export function useDropdownMenu(
  props: UseDropdownMenuProps,
  emit: (event: 'update:open' | 'change', value: boolean) => void
) {
  const generatedId = useId()

  const machineProps = computed(() => ({
    id: props.id ?? generatedId,
    open: props.open,
    defaultOpen: props.open === undefined ? props.defaultOpen : undefined,
    closeOnSelect: props.closeOnSelect,
    loopFocus: props.loopFocus,
    positioning: props.positioning,
    onOpenChange(details: { open: boolean }) {
      props.onOpenChange?.(details.open)
      emit('update:open', details.open)
      emit('change', details.open)
    },
  }))

  const service = useMachine(menuMachine, machineProps)
  const api = computed(() => menuConnect(service, normalizeProps))

  return api
}
