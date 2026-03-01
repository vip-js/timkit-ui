import { accordionMachine, accordionConnect, type AccordionApi } from '@timui/core'
import { useMachine, normalizeProps } from '../utils/machine'

type MachineEvent = string | { type: string; [key: string]: object }
type MachineSend = (event: MachineEvent) => void

export type UseAccordionProps = {
    id?: string
    value?: string[]
    multiple?: boolean
    collapsible?: boolean
    disabled?: boolean
    onValueChange?: (details: object) => void
}

export function setupAccordionMachine(component: WechatMiniprogram.Component.TrivialInstance, props: UseAccordionProps): {
    service: object
    cleanup: () => void
    send: MachineSend
    connect: (state: object, send: MachineSend) => AccordionApi
} {
    const machine = accordionMachine({
        id: props.id || 'accordion',
        value: props.value,
        multiple: props.multiple,
        collapsible: props.collapsible,
        disabled: props.disabled,
        onValueChange: props.onValueChange,
    })

    const controller = useMachine(component, machine)

    return {
        service: controller.service,
        cleanup: controller.start(),
        send: controller.send as MachineSend,
        connect: (state: object, send: MachineSend) =>
            accordionConnect(state, send, normalizeProps) as AccordionApi
    }
}
