import { collapsibleConnect, collapsibleMachine } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, useId } from 'vue'

type CollapsibleProps = {
  id?: string
  open?: boolean
  defaultOpen?: boolean
  disabled?: boolean
  onOpenChange?: (open: boolean) => void
}

export function useCollapsible(props: CollapsibleProps = {}) {
  const generatedId = useId()

  const service = useMachine(collapsibleMachine, {
    id: props.id ?? generatedId,
    open: props.open,
    defaultOpen: props.defaultOpen,
    disabled: props.disabled,
    onOpenChange(details) {
      props.onOpenChange?.(details.open)
    },
  })

  return computed(() => collapsibleConnect(service, normalizeProps))
}
