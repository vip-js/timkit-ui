import * as React from 'react'
import type { CheckboxProps as CoreCheckboxProps } from '@timui/core'
import { checkboxConnect, checkboxMachine, createTimEvent } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/react'

export interface UseCheckboxProps extends Omit<CoreCheckboxProps, 'id'> {
  id?: string
}

export function useCheckbox(props: UseCheckboxProps) {
  const generatedId = React.useId()
  const checkboxId = props.id ?? generatedId

  const [, setPhase] = React.useState(0)
  const service = useMachine(checkboxMachine, {
    id: checkboxId,
    ...(props.checked === undefined
      ? { defaultChecked: props.defaultChecked }
      : { checked: props.checked === 'indeterminate' ? 'indeterminate' : props.checked === true }),
    disabled: props.disabled || undefined,
    readOnly: props.readOnly || undefined,
    required: props.required,
    name: props.name,
    value: props.value ?? 'on',
    onCheckedChange(details) {
      setPhase((phase) => phase + 1)
      props.onCheckedChange?.(createTimEvent('change', checkboxId, { checked: !!details.checked }))
    },
  })
  void setPhase

  return checkboxConnect(service, normalizeProps)
}
