import { dialogConnect, dialogMachine, type DialogApi } from '@timui/core'

import { normalizeProps, useMachine, bindMachine } from '../utils/machine'

type MachineEvent = string | { type: string; [key: string]: object }
type MachineSend = (event: MachineEvent) => void

export type UseSheetProps = {
  id?: string
  open?: boolean
  onOpenChange?: (details: { open: boolean }) => void
}

export function setupSheetMachine(
  component: WechatMiniprogram.Component.TrivialInstance,
  props: UseSheetProps
): {
  service: object
  start: () => () => void
  send: MachineSend
  connect: (state: object, send: MachineSend) => DialogApi
} {
  const machine = bindMachine(dialogMachine, {
    id: props.id || 'sheet',
    defaultOpen: props.open === true ? true : undefined,
    onOpenChange: props.onOpenChange,
  })

  const controller = useMachine(component, machine)

  return {
    service: controller.service,
    start: () => controller.start(),
    send: controller.send as MachineSend,
    connect: (state: object, send: MachineSend) => dialogConnect(state as never, normalizeProps) as DialogApi,
  }
}
