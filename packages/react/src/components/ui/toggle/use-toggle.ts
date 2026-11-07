import * as React from 'react'
import { toggleConnect, toggleMachine } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/react'

export interface UseToggleProps {
  pressed?: boolean | null
  defaultPressed?: boolean
  onPressedChange?: (pressed: boolean) => void
  disabled?: boolean
}

export function useToggle(props: UseToggleProps) {
  const controlled = props.pressed !== undefined
  const service = useMachine(toggleMachine, {
    ...(controlled ? { pressed: props.pressed === true } : { defaultPressed: props.defaultPressed }),
    disabled: props.disabled,
    onPressedChange: props.onPressedChange,
  })

  return toggleConnect(service, normalizeProps)
}
