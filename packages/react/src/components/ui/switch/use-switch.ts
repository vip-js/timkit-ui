import * as React from 'react'
import type { SwitchProps as CoreSwitchProps } from '@timui/core'
import { createTimEvent, switchConnect, switchMachine } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/react'

export interface UseSwitchProps extends Omit<CoreSwitchProps, 'id'> {
  id?: string
}

export function useSwitch(props: UseSwitchProps) {
  const generatedId = React.useId()
  const switchId = props.id ?? generatedId

  const [, setChecked] = React.useState(props.checked ?? props.defaultChecked ?? false)
  const service = useMachine(switchMachine, {
    id: switchId,
    ...(props.checked === undefined ? { defaultChecked: props.defaultChecked } : { checked: props.checked === true }),
    disabled: props.disabled || undefined,
    readOnly: props.readOnly || undefined,
    required: props.required,
    name: props.name,
    value: props.value ?? 'on',
    onCheckedChange(details) {
      if (props.checked === undefined) setChecked(details.checked)
      props.onCheckedChange?.(createTimEvent('change', switchId, { checked: details.checked }))
    },
  })

  return switchConnect(service, normalizeProps)
}
