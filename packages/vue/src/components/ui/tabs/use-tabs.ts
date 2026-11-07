import { tabsConnect, tabsMachine } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, ref, useId, watchEffect } from 'vue'

import { usePassedProp } from '../../../hooks/passed-prop'

export interface UseTabsProps {
  modelValue?: string | null
  value?: string | null
  defaultValue?: string
  id?: string
  orientation?: 'horizontal' | 'vertical'
  activationMode?: 'manual' | 'automatic'
  loopFocus?: boolean
  composite?: boolean
  deselectable?: boolean
  onValueChange?: (value: string) => void
  onFocusChange?: (value: string) => void
}

export interface UseTabsEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
  (e: 'focusChange', value: string): void
}

export function useTabs(props: UseTabsProps, emit: UseTabsEmits) {
  const generatedId = useId()
  const passed = usePassedProp()

  const machineProps = computed(() => {
    const valueProp = passed<string | null>(props, 'value')
    const modelProp = passed<string | null>(props, 'modelValue')
    const value = valueProp !== undefined ? valueProp : modelProp
    return {
      id: props.id ?? generatedId,
      ...(value === undefined ? { defaultValue: props.defaultValue } : { value: value ?? '' }),
      orientation: props.orientation,
      activationMode: props.activationMode ?? 'automatic',
      loopFocus: props.loopFocus,
      composite: props.composite,
      deselectable: props.deselectable,
      onValueChange(details: { value: string }) {
        props.onValueChange?.(details.value)
        emit('update:modelValue', details.value)
        emit('change', details.value)
      },
      onFocusChange(details: { focusedValue: string }) {
        emit('focusChange', details.focusedValue)
      },
    }
  })

  const service = useMachine(tabsMachine, machineProps)
  const phase = ref('')
  watchEffect(() => {
    phase.value = String(service.context.get('value') ?? '')
  })
  const api = computed(() => {
    phase.value
    return tabsConnect(service, normalizeProps)
  })

  return api
}
