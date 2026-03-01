import * as React from 'react'
import type { SwitchProps as CoreSwitchProps } from '@timui/core'
import { switchConnect, switchMachine, createTimEvent } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/react'

export interface UseSwitchProps extends Omit<CoreSwitchProps, 'id'> {
    id?: string
}

export function useSwitch(props: UseSwitchProps) {
    const generatedId = React.useId()
    const switchId = props.id ?? generatedId

    const service = useMachine(switchMachine, {
        id: switchId,
        checked: props.checked,
        defaultChecked: props.defaultChecked,
        disabled: props.disabled,
        required: props.required,
        name: props.name,
        value: props.value ?? 'on',
        onCheckedChange(details) {
            props.onCheckedChange?.(createTimEvent('change', switchId, { checked: details.checked }))
        },
    })

    const api = React.useMemo(() => switchConnect(service, normalizeProps), [service])

    return api
}
