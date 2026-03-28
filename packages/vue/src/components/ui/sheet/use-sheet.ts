import { dialogConnect, dialogMachine, type DialogApi } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, type ComputedRef, useId } from 'vue'

export type UseSheetProps = {
  id?: string
  open?: boolean
  defaultOpen?: boolean
  modal?: boolean
  onOpenChange?: (open: boolean) => void
}

export function useSheet(props: UseSheetProps) {
  const generatedId = useId()

  const service = useMachine(dialogMachine, {
    id: props.id ?? generatedId,
    open: props.open,
    defaultOpen: props.defaultOpen,
    modal: props.modal ?? true,
    onOpenChange(details) {
      props.onOpenChange?.(details.open)
    },
  })

  return computed(() => dialogConnect(service, normalizeProps))
}
