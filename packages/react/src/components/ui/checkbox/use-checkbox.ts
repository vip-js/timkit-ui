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

    const service = useMachine(checkboxMachine, {
        id: checkboxId,
        checked: props.checked,
        defaultChecked: props.defaultChecked,
        disabled: props.disabled,
        required: props.required,
        name: props.name,
        value: props.value ?? 'on',
        onCheckedChange(details) {
            props.onCheckedChange?.(
                createTimEvent('change', checkboxId, { checked: !!details.checked })
            )
        },
    })

    const api = React.useMemo(() => checkboxConnect(service, normalizeProps), [service])

    return api
}
