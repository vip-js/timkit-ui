import { switchMachine, switchConnect } from '@timui/core'
import { useMachine, normalizeProps } from '../utils/machine'

type MachineEvent = string | { type: string; [key: string]: object }
type MachineSend = (event: MachineEvent) => void
type SwitchInstance = WechatMiniprogram.Component.TrivialInstance & {
    properties: {
        checked?: boolean
        disabled?: boolean
        required?: boolean
        readOnly?: boolean
        value?: string
        name?: string
        label?: string
        id?: string
    }
    triggerEvent: (name: string, detail?: Record<string, object>) => void
}

export function setupSwitchMachine(instance: SwitchInstance) {
    const { checked, disabled, required, readOnly, value, name, label, id } = instance.properties

    const machine = switchMachine({
        id: id || 'switch',
        name,
        value,
        label,
        disabled,
        required,
        readOnly,
        checked,
        onCheckedChange: (details: { checked: boolean }) => {
            instance.triggerEvent('change', details)
            instance.triggerEvent('input', { value: details.checked })
        },
    })

    const controller = useMachine(instance, machine)

    return {
        controller,
        connect: (state: object, send: MachineSend) =>
            switchConnect(state, send, normalizeProps)
    }
}
