import { computed } from 'vue'
import { toggleMachine, toggleConnect } from '@timui/core'
import { useMachine, normalizeProps } from '@zag-js/vue'

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
