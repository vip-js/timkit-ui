import * as React from 'react'
import type { RadioGroupProps as CoreRadioGroupProps } from '@timui/core'
import { createTimEvent, radioGroupConnect, radioGroupMachine } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/react'

export interface UseRadioGroupProps extends Omit<CoreRadioGroupProps, 'id'> {
  id?: string
}

export function useRadioGroup(props: UseRadioGroupProps) {
  const generatedId = React.useId()
  const radioGroupId = props.id ?? generatedId

  const service = useMachine(radioGroupMachine, {
    id: radioGroupId,
    value: props.value,
    defaultValue: props.defaultValue,
    disabled: props.disabled,
    required: props.required,
    name: props.name,
    onValueChange(details) {
      props.onValueChange?.(createTimEvent('change', radioGroupId, { value: details.value }))
    },
  })

  const api = React.useMemo(() => radioGroupConnect(service, normalizeProps), [service])

  return api
}
