import { progressMachine, progressConnect, type ProgressMachineOptions } from '@timui/core'
import { useMachine, normalizeProps } from '../utils/machine'

export type WeappProgressApi = ReturnType<typeof progressConnect> & Record<string, object>

export type WeappProgressService = ReturnType<typeof useMachine>['service']
type MachineSend = (event: string | { type: string; [key: string]: object }) => void

export function setupProgressMachine(
    component: WechatMiniprogram.Component.TrivialInstance,
    options: ProgressMachineOptions
) {
    const machine = progressMachine(options)
    return useMachine(component, machine)
}

export function connectProgressMachine(state: object, send: MachineSend): WeappProgressApi {
    return progressConnect(state, send, normalizeProps)
}
