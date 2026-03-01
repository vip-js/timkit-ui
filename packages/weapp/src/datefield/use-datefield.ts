import { dateFieldMachine, dateFieldConnect, type DateFieldApi } from '@timui/core'
import { useMachine, normalizeProps } from '../utils/machine'

type MachineEvent = string | { type: string; [key: string]: object }
type MachineSend = (event: MachineEvent) => void

export type UseDateFieldProps = {
    id?: string
    value?: string[]
    min?: string[]
    max?: string[]
    disabled?: boolean
    onValueChange?: (details: object) => void
}

export function setupDateFieldMachine(component: WechatMiniprogram.Component.TrivialInstance, props: UseDateFieldProps): {
    service: object
    cleanup: () => void
    send: MachineSend
    connect: (state: object, send: MachineSend) => DateFieldApi
} {
    const machine = dateFieldMachine({
        id: props.id || 'datefield',
        value: props.value,
        min: props.min,
        max: props.max,
        disabled: props.disabled,
        onValueChange: props.onValueChange,
    })

    const controller = useMachine(component, machine)

    return {
        service: controller.service,
        cleanup: controller.start(),
        send: controller.send as MachineSend,
        connect: (state: object, send: MachineSend) => dateFieldConnect(state, send) as DateFieldApi
    }
}
