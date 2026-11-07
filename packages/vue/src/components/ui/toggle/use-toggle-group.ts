import { toggleGroupConnect, toggleGroupMachine, type ToggleGroupApi } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, ref, useId, watchEffect } from 'vue'

import { usePassedProp } from '../../../hooks/passed-prop'

export type UseToggleGroupProps = {
  id?: string
  type?: 'single' | 'multiple'
  value?: string | string[] | null
  modelValue?: string | string[] | null
  defaultValue?: string | string[]
  disabled?: boolean
  multiple?: boolean
  loop?: boolean
  onValueChange?: (value: string[]) => void
}

type ToggleGroupEmit = {
  (event: 'update:modelValue', value: string | string[]): void
  (event: 'change', value: string | string[]): void
}

const toArray = (value?: string | string[] | null) => {
  if (value === undefined) return undefined
  if (value == null || value === '') return []
  return Array.isArray(value) ? value : [value]
}

export function useToggleGroup(props: UseToggleGroupProps, emit?: ToggleGroupEmit) {
  const generatedId = useId()
  const passed = usePassedProp()
  const machineProps = computed(() => {
    const multiple = props.type ? props.type === 'multiple' : !!props.multiple
    const raw = props.value !== undefined ? props.value : props.modelValue
    const value = toArray(raw)
    const defaultValue = value === undefined ? toArray(props.defaultValue) : undefined
    return {
      id: props.id ?? generatedId,
      multiple,
      ...(value === undefined ? { defaultValue } : { value }),
      disabled: props.disabled,
      ...(passed<boolean | undefined>(props, 'loop') === undefined
        ? {}
        : { loopFocus: props.loop }),
      onValueChange(details: { value: string[] }) {
        props.onValueChange?.(details.value)
        const nextValue = multiple ? details.value : details.value[0] || ''
        emit?.('update:modelValue', nextValue)
        emit?.('change', nextValue)
      },
    }
  })

  const service = useMachine(toggleGroupMachine, machineProps)

  const phase = ref('')
  watchEffect(() => {
    const value = service.context.get('value')
    const focused = service.context.get('focusedId')
    phase.value = `${Array.isArray(value) ? value.join('\0') : ''}|${focused ?? ''}`
  })
  return computed(() => {
    phase.value
    return toggleGroupConnect(service, normalizeProps)
  })
}
