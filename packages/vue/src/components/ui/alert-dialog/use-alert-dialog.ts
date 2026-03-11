import type { AlertDialogVueProps as CoreAlertDialogProps } from '@timui/core'
import { dialogConnect, dialogMachine } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, watch } from 'vue'

export interface UseAlertDialogProps extends Omit<CoreAlertDialogProps, 'id'> {
  id?: string
  defaultOpen?: boolean
}

export interface UseAlertDialogEmits {
  (e: 'update:open', value: boolean): void
  (e: 'openChange', value: boolean): void
}

let staticId = 0

export function useAlertDialog(props: UseAlertDialogProps, emit: UseAlertDialogEmits) {
  const localId = `alert-dialog-${++staticId}`

  const machineProps = computed(() => ({
    id: props.id ?? localId,
    open: props.open,
    defaultOpen: props.defaultOpen ?? false,
    role: 'alertdialog' as const, // Force alertdialog role
    modal: true, // Alerts are always modal
    onOpenChange(details: { open: boolean }) {
      emit('update:open', details.open)
      emit('openChange', details.open)
    },
  }))

  const service = useMachine(dialogMachine, machineProps)
  const api = computed(() => dialogConnect(service, normalizeProps))

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
