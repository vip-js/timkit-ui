import { tabsConnect, tabsMachine } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, useId } from 'vue'

export interface UseTabsProps {
  modelValue?: string
  value?: string
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

  const machineProps = computed(() => {
    const value = props.value ?? props.modelValue
    return {
      id: props.id ?? generatedId,
      value,
      defaultValue: value === undefined ? props.defaultValue : undefined,
      orientation: props.orientation,
      activationMode: props.activationMode,
      loopFocus: props.loopFocus,
      composite: props.composite,
      deselectable: props.deselectable,
      onValueChange(details: { value: string }) {
        props.onValueChange?.(details.value)
        emit('update:modelValue', details.value)
        emit('change', details.value)
      },
      onFocusChange(details: { focusedValue: string }) {
        props.onFocusChange?.(details.focusedValue)
        emit('focusChange', details.focusedValue)
      },
    }
  })

  const service = useMachine(tabsMachine, machineProps)
  const api = computed(() => tabsConnect(service, normalizeProps))

  return api
}
