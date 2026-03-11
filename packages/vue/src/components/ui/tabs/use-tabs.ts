import { tabsConnect, tabsMachine } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed } from 'vue'

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
}

export interface UseTabsEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
  (e: 'focusChange', value: string): void
}

let staticId = 0

export function useTabs(props: UseTabsProps, emit: UseTabsEmits) {
  const localId = `tabs-${++staticId}`

  const machineProps = computed(() => {
    const value = props.value ?? props.modelValue ?? null
    return {
      id: props.id ?? localId,
      value,
      defaultValue: value == null ? (props.defaultValue ?? null) : undefined,
      orientation: props.orientation,
      activationMode: props.activationMode,
      loopFocus: props.loopFocus,
      composite: props.composite,
      deselectable: props.deselectable,
      onValueChange(details: { value: string }) {
        emit('update:modelValue', details.value)
        emit('change', details.value)
      },
      onFocusChange(details: { focusedValue: string }) {
        emit('focusChange', details.focusedValue)
      },
    }
  })

  const service = useMachine(tabsMachine, machineProps)
  const api = computed(() => tabsConnect(service, normalizeProps))

  return api
}
