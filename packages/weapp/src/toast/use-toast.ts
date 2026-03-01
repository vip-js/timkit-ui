import { toastMachine, toastConnect, type ToastApi } from '@timui/core'
import { useMachine } from '../utils/machine'

type MachineEvent = string | { type: string; [key: string]: object }
type MachineSend = (event: MachineEvent) => void

export type ToastVariant = 'info' | 'success' | 'warning' | 'error'

export type UseToastProps = {
    id?: string
    type?: ToastVariant
    duration?: number
    onStatusChange?: (details: object) => void
}

export function setupToastMachine(component: WechatMiniprogram.Component.TrivialInstance, props: UseToastProps): {
    service: object
    cleanup: () => void
    send: MachineSend
    connect: (state: object, send: MachineSend) => ToastApi
} {
    const machine = toastMachine({
        id: props.id || 'toast',
        type: props.type || 'info',
        duration: props.duration,
        onStatusChange: props.onStatusChange,
    })

    const controller = useMachine(component, machine)

    return {
        service: controller.service,
        cleanup: controller.start(),
        send: controller.send as MachineSend,
        connect: (state: object, send: MachineSend) => toastConnect(state, send) as ToastApi
    }
}
