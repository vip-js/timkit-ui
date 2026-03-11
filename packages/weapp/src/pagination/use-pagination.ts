import { paginationConnect, paginationMachine, type PaginationMachineOptions } from '@timui/core'

import { normalizeProps, useMachine } from '../utils/machine'

export type WeappPaginationApi = ReturnType<typeof paginationConnect> & {
  goToPrevPage?: () => void
  goToNextPage?: () => void
  goToPage?: (page: number) => void
}

export type WeappPaginationService = ReturnType<typeof useMachine>['service']
type MachineSend = (event: string | { type: string; [key: string]: object }) => void

export function setupPaginationMachine(
  component: WechatMiniprogram.Component.TrivialInstance,
  options: PaginationMachineOptions
) {
  const machine = paginationMachine(options)
  return useMachine(component, machine)
}

export function connectPaginationMachine(state: object, send: MachineSend): WeappPaginationApi {
  return paginationConnect(state, send, normalizeProps)
}
