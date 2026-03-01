import { radioGroupMachine, radioGroupConnect } from '@timui/core'
import { useMachine, normalizeProps } from '../utils/machine'

type MachineEvent = string | { type: string; [key: string]: object }
type MachineSend = (event: MachineEvent) => void
type RadioGroupInstance = WechatMiniprogram.Component.TrivialInstance & {
    properties: {
        id?: string
        value?: string
        name?: string
        disabled?: boolean
        orientation?: 'horizontal' | 'vertical'
    }
    triggerEvent: (name: string, detail?: Record<string, object>) => void
}

export function setupRadioGroupMachine(instance: RadioGroupInstance) {
    const machine = radioGroupMachine({
        id: instance.properties.id || 'radio-group',
        value: instance.properties.value,
        name: instance.properties.name,
        disabled: instance.properties.disabled,
        orientation: instance.properties.orientation as 'horizontal' | 'vertical',
        onValueChange: (details: { value: string }) => {
            // @ts-ignore
            instance.triggerEvent('change', details)
        },
    })

    const controller = useMachine(instance, machine)

    return {
        controller,
        connect: (state: object, send: MachineSend) =>
            radioGroupConnect(state, send, normalizeProps)
    }
}
