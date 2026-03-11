import { avatarConnect, avatarMachine, type AvatarMachineOptions } from '@timui/core'

import { normalizeProps, useMachine } from '../utils/machine'

export type WeappAvatarApi = ReturnType<typeof avatarConnect>

export type WeappAvatarService = ReturnType<typeof useMachine>['service']

type MachineSend = (event: string | { type: string; [key: string]: object }) => void

export function setupAvatarMachine(
  component: WechatMiniprogram.Component.TrivialInstance,
  options: AvatarMachineOptions
) {
  const machine = avatarMachine(options)
  return useMachine(component, machine)
}

export function connectAvatarMachine(state: object, send: MachineSend): WeappAvatarApi {
  return avatarConnect(state, send, normalizeProps)
}
