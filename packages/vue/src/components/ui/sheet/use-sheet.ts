import { dialogConnect, dialogMachine, type DialogApi } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, type ComputedRef, useId, watch } from 'vue'

import { usePassedProp } from '../../../hooks/passed-prop'

export type UseSheetProps = {
  id?: string
  open?: boolean | null
  defaultOpen?: boolean
  modal?: boolean
  onOpenChange?: (open: boolean) => void
}

type SheetEmit = {
  (event: 'update:open', open: boolean): void
  (event: 'openChange', open: boolean): void
}

export function useSheet(props: UseSheetProps, emit?: SheetEmit) {
  const generatedId = useId()
  const passed = usePassedProp()
  const machineProps = computed(() => {
    const open = passed<boolean | null>(props, 'open')
    const defaultOpen = passed<boolean>(props, 'defaultOpen')
    return {
      id: props.id ?? generatedId,
      ...(open === undefined ? { defaultOpen } : { open: open === true }),
      modal: props.modal ?? true,
      onOpenChange(details: { open: boolean }) {
        emit?.('update:open', details.open)
        emit?.('openChange', details.open)
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

  return api
}
