import type { AlertDialogVueProps as CoreAlertDialogProps } from '@timui/core'
import { dialogConnect, dialogMachine } from '@timui/core'
import { usePassedProp } from '../../../hooks/passed-prop'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, ref, useId, watch, watchEffect } from 'vue'

export interface UseAlertDialogProps extends Omit<CoreAlertDialogProps, 'id'> {
  id?: string
  defaultOpen?: boolean
  disabled?: boolean
}

export interface UseAlertDialogEmits {
  (e: 'update:open', value: boolean): void
  (e: 'openChange', value: boolean): void
}

export function useAlertDialog(props: UseAlertDialogProps, emit: UseAlertDialogEmits) {
  const generatedId = useId()
  const passed = usePassedProp()

  const machineProps = computed(() => {
    const open = passed<boolean | null>(props, 'open')
    return {
      id: props.id ?? generatedId,
      ...(open === undefined
        ? { defaultOpen: passed<boolean>(props, 'defaultOpen') ?? false }
        : { open: open === true }),
      role: 'alertdialog' as const,
      modal: true,
      closeOnInteractOutside: false,
      onOpenChange(details: { open: boolean }) {
        emit('update:open', details.open)
        emit('openChange', details.open)
      },
    }
  })

  const service = useMachine(dialogMachine, machineProps)
  const phase = ref(false)
  watchEffect(() => {
    phase.value = service.state.matches('open')
  })
  const api = computed(() => {
    phase.value
    return { ...dialogConnect(service, normalizeProps), disabled: props.disabled === true }
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
