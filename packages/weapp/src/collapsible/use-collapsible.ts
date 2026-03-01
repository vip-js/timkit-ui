import { collapsibleMachine, collapsibleConnect, type CollapsibleApi } from '@timui/core'
import { useMachine, normalizeProps } from '../utils/machine'

type MachineEvent = string | { type: string; [key: string]: object }
type MachineSend = (event: MachineEvent) => void

export type UseCollapsibleProps = {
    id?: string
    open?: boolean
    disabled?: boolean
    onOpenChange?: (details: { open: boolean }) => void
}

export function setupCollapsibleMachine(component: WechatMiniprogram.Component.TrivialInstance, props: UseCollapsibleProps): {
    service: object
    cleanup: () => void
    send: MachineSend
    connect: (state: object, send: MachineSend) => CollapsibleApi
} {
    const machine = collapsibleMachine({
        id: props.id || 'collapsible',
        open: props.open,
        disabled: props.disabled,
        onOpenChange: props.onOpenChange,
    })

    const controller = useMachine(component, machine)

    return {
        service: controller.service,
        cleanup: controller.start(),
        send: controller.send as MachineSend,
        connect: (state: object, send: MachineSend) =>
            collapsibleConnect(state, send) as CollapsibleApi
    }
}
