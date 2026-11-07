import { collapsibleConnect, collapsibleMachine, type CollapsibleApi } from '@timui/core'

import { normalizeProps, useMachine, bindMachine } from '../utils/machine'

type MachineEvent = string | { type: string; [key: string]: object }
type MachineSend = (event: MachineEvent) => void

export type UseCollapsibleProps = {
  id?: string
  open?: boolean
  disabled?: boolean
  onOpenChange?: (details: { open: boolean }) => void
}

export function setupCollapsibleMachine(
  component: WechatMiniprogram.Component.TrivialInstance,
  props: UseCollapsibleProps
): {
  service: object
  start: () => () => void
  send: MachineSend
  connect: (state: object, send: MachineSend) => CollapsibleApi
} {
  const machine = bindMachine(collapsibleMachine, {
    id: props.id || 'collapsible',
    ...(props.open ? { defaultOpen: true } : {}),
    disabled: props.disabled || undefined,
    onOpenChange: props.onOpenChange,
  })

  const controller = useMachine(component, machine)

  return {
    service: controller.service,
    start: () => controller.start(),
    send: controller.send as MachineSend,
    connect: (state: object, send: MachineSend) =>
      collapsibleConnect(state as never, normalizeProps) as CollapsibleApi,
  }
}
