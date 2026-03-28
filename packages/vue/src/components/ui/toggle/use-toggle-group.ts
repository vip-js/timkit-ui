import { toggleGroupConnect, toggleGroupMachine, type ToggleGroupApi } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, type ComputedRef, useId } from 'vue'

export type UseToggleGroupProps = {
  id?: string
  value?: string[]
  defaultValue?: string[]
  disabled?: boolean
  multiple?: boolean
  loop?: boolean
  onValueChange?: (value: string[]) => void
}

export function useToggleGroup(props: UseToggleGroupProps) {
  const generatedId = useId()

  const service = useMachine(toggleGroupMachine, {
    id: props.id ?? generatedId,
    value: props.value,
    defaultValue: props.defaultValue,
    disabled: props.disabled,
    multiple: props.multiple,
    loopFocus: props.loop,
    onValueChange(details) {
      props.onValueChange?.(details.value)
    },
  })

  return computed(() => toggleGroupConnect(service, normalizeProps))
}
