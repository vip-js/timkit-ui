import type { DialogVueProps as CoreDialogProps } from '@timui/core'
import { dialogConnect, dialogMachine } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, useId, watch } from 'vue'

import { usePassedProp } from '../../../hooks/passed-prop'

export interface UseDialogProps extends Omit<CoreDialogProps, 'id'> {
  id?: string
  defaultOpen?: boolean
}

export interface UseDialogEmits {
  (e: 'update:open', value: boolean): void
  (e: 'openChange', value: boolean): void
}

export function useDialog(props: UseDialogProps, emit: UseDialogEmits) {
  const generatedId = useId()
  const passed = usePassedProp()

  const machineProps = computed(() => {
    const open = passed<boolean | null>(props, 'open')
    return {
    id: props.id ?? generatedId,
    ...(open === undefined ? { defaultOpen: props.defaultOpen } : { open: open === true }),
    modal: passed<boolean | null>(props, 'modal') !== false,
    onOpenChange(details: { open: boolean }) {
      emit('update:open', details.open)
      emit('openChange', details.open)
    },
  }
  })

  const service = useMachine(dialogMachine, machineProps)
  const api = computed(() => dialogConnect(service, normalizeProps))

  watch(
    () => api.value.open,
    (open, _previous, onCleanup) => {
      if (!open) return
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key !== 'Escape') return
        event.preventDefault()
        api.value.setOpen(false)
      }
      document.addEventListener('keydown', onKeyDown)
      onCleanup(() => document.removeEventListener('keydown', onKeyDown))
    }
  )

  // Controlled component sync logic
  watch(
    () => passed<boolean | null>(props, 'open'),
    (val) => {
      if (val === undefined) return
      const next = val === true
      if (next !== api.value.open) api.value.setOpen(next)
    }
  )

  return api
}
