import { dialogMachine, dialogConnect, type DialogApi } from '@timui/core'
import { useMachine, normalizeProps } from '../utils/machine'

type MachineEvent = string | { type: string; [key: string]: object }
type MachineSend = (event: MachineEvent) => void

export type UseSheetProps = {
    id?: string
    open?: boolean
    onOpenChange?: (details: { open: boolean }) => void
}

export function setupSheetMachine(component: WechatMiniprogram.Component.TrivialInstance, props: UseSheetProps): {
    service: object
    cleanup: () => void
    send: MachineSend
    connect: (state: object, send: MachineSend) => DialogApi
} {
    const machine = dialogMachine({
        id: props.id || 'sheet',
        open: props.open,
        onOpenChange: props.onOpenChange,
    })

    const controller = useMachine(component, machine)

    return {
        service: controller.service,
        cleanup: controller.start(),
        send: controller.send as MachineSend,
        connect: (state: object, send: MachineSend) => dialogConnect(state, send) as DialogApi
    }
}
