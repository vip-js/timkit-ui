import { selectMachine, selectConnect, type SelectApi } from '@timui/core'
import { useMachine } from '../utils/machine'

type MachineEvent = string | { type: string; [key: string]: object }
type MachineSend = (event: MachineEvent) => void

export type UseMultiselectProps = {
    id?: string
    collection: object
    value?: string[]
    name?: string
    disabled?: boolean
    multiple?: boolean
    onValueChange?: (details: object) => void
}

export function setupMultiselectMachine(component: WechatMiniprogram.Component.TrivialInstance, props: UseMultiselectProps): {
    service: object
    cleanup: () => void
    send: MachineSend
    connect: (state: object, send: MachineSend) => SelectApi
} {
    const machine = selectMachine({
        id: props.id || 'multiselect',
        collection: props.collection,
        value: props.value,
        name: props.name,
        disabled: props.disabled,
        multiple: props.multiple,
        positioning: { placement: 'bottom' },
        onValueChange: props.onValueChange,
    })

    const controller = useMachine(component, machine)

    return {
        service: controller.service,
        cleanup: controller.start(),
        send: controller.send as MachineSend,
        connect: (state: object, send: MachineSend) => selectConnect(state, send) as SelectApi
    }
}
