import { toggleConnect, toggleMachine } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, ref, watchEffect } from 'vue'

import { usePassedProp } from '../../../hooks/passed-prop'

type ToggleProps = {
  pressed?: boolean | null
  modelValue?: boolean | null
  defaultPressed?: boolean
  disabled?: boolean
  onPressedChange?: (pressed: boolean) => void
}

type ToggleEmit = {
  (event: 'update:pressed', value: boolean): void
  (event: 'update:modelValue', value: boolean): void
  (event: 'pressedChange', value: boolean): void
  (event: 'change', value: boolean): void
}

export function useToggle(props: ToggleProps = {}, emit?: ToggleEmit) {
  const passed = usePassedProp()
  const machineProps = computed(() => {
    const pressedProp = passed<boolean | null>(props, 'pressed')
    const modelProp = passed<boolean | null>(props, 'modelValue')
    const pressed = pressedProp !== undefined ? pressedProp : modelProp
    const defaultPressed = passed<boolean>(props, 'defaultPressed')
    return {
      ...(pressed === undefined ? { defaultPressed } : { pressed: pressed === true }),
      disabled: props.disabled === true ? true : undefined,
      onPressedChange(next: boolean) {
        emit?.('update:pressed', next)
        emit?.('update:modelValue', next)
        emit?.('pressedChange', next)
        emit?.('change', next)
      },
    }
  })
  const service = useMachine(toggleMachine, machineProps)
  const initialPressed = passed<boolean | null>(props, 'pressed')
  const initialModel = passed<boolean | null>(props, 'modelValue')
  const initial = initialPressed !== undefined ? initialPressed : initialModel
  const phase = ref(initial === undefined ? Boolean(props.defaultPressed) : initial === true)
  watchEffect(() => {
    phase.value = Boolean(service.context.get('pressed'))
  })

  return computed(() => {
    phase.value
    return toggleConnect(service, normalizeProps)
  })
}
