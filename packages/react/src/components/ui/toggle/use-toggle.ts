import * as React from 'react'
import { normalizeProps, useMachine } from '@zag-js/react'
import { toggleMachine, toggleConnect } from '@timui/core'

export interface UseToggleProps {
    pressed?: boolean
    defaultPressed?: boolean
    onPressedChange?: (pressed: boolean) => void
    disabled?: boolean
}

export function useToggle(props: UseToggleProps) {
    const service = useMachine(toggleMachine, {
        pressed: props.pressed,
        defaultPressed: props.defaultPressed,
        disabled: props.disabled,
        onPressedChange: props.onPressedChange,
    })

    return React.useMemo(() => toggleConnect(service, normalizeProps), [service])
}
