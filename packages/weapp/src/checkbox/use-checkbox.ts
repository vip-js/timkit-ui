import { checkboxMachine, checkboxConnect } from '@timui/core'
import { useMachine, normalizeProps } from '../utils/machine'

type MachineEvent = string | { type: string; [key: string]: object }
type MachineSend = (event: MachineEvent) => void
type CheckboxInstance = WechatMiniprogram.Component.TrivialInstance & {
    properties: {
        checked?: boolean | 'indeterminate'
        disabled?: boolean
        required?: boolean
        readOnly?: boolean
        value?: string
        name?: string
        id?: string
    }
    triggerEvent: (name: string, detail?: Record<string, object>) => void
}

export function setupCheckboxMachine(instance: CheckboxInstance) {
    const { checked, disabled, required, readOnly, value, name, id } = instance.properties

    const machine = checkboxMachine({
        id: id || 'checkbox',
        name,
        value,
        disabled,
        required,
        readOnly,
        checked: checked === 'indeterminate' ? 'indeterminate' : !!checked,
        onCheckedChange: (details) => {
            instance.triggerEvent('change', details)
            instance.triggerEvent('input', { value: details.checked })
        },
    })

    const controller = useMachine(instance, machine)

    return {
        controller,
        connect: (state: object, send: MachineSend) =>
            checkboxConnect(state, send, normalizeProps)
    }
}
