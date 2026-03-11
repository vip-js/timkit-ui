import type { DialogVueProps as CoreDialogProps } from '@timui/core'
import { dialogConnect, dialogMachine } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, watch } from 'vue'

export interface UseDialogProps extends Omit<CoreDialogProps, 'id'> {
  id?: string
  defaultOpen?: boolean
}

export interface UseDialogEmits {
  (e: 'update:open', value: boolean): void
  (e: 'openChange', value: boolean): void
}

let staticId = 0

export function useDialog(props: UseDialogProps, emit: UseDialogEmits) {
  const localId = `dialog-${++staticId}`

  const machineProps = computed(() => ({
    id: props.id ?? localId,
    open: props.open,
    defaultOpen: props.defaultOpen,
    modal: props.modal !== false,
    onOpenChange(details: { open: boolean }) {
      emit('update:open', details.open)
      emit('openChange', details.open)
    },
  }))

  const service = useMachine(dialogMachine, machineProps)
  const api = computed(() => dialogConnect(service, normalizeProps))

  // Controlled component sync logic
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
