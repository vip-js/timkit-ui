import { toggleConnect, toggleMachine } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed } from 'vue'

type ToggleProps = {
  pressed?: boolean
  defaultPressed?: boolean
  disabled?: boolean
  onPressedChange?: (pressed: boolean) => void
}

export function useToggle(props: ToggleProps = {}) {
  const service = useMachine(toggleMachine, {
    pressed: props.pressed,
    defaultPressed: props.defaultPressed,
    disabled: props.disabled,
    onPressedChange: props.onPressedChange,
  })

  return computed(() => toggleConnect(service, normalizeProps))
}
