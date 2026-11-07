import { toggleConnect, toggleMachine, type ToggleApi } from '@timui/core'

import { normalizeProps, useMachine, bindMachine } from '../utils/machine'

type MachineEvent = string | { type: string; [key: string]: object }
type MachineSend = (event: MachineEvent) => void

export type UseToggleProps = {
  id?: string
  pressed?: boolean | null
  disabled?: boolean
  onPressedChange?: (details: { pressed: boolean }) => void
}

export function setupToggleMachine(
  component: WechatMiniprogram.Component.TrivialInstance,
  props: UseToggleProps
): {
  service: object
  start: () => () => void
  send: MachineSend
  connect: (state: object, send: MachineSend) => ToggleApi
} {
  const machine = bindMachine(toggleMachine, {
    id: props.id || 'toggle',
    ...(props.pressed === true ? { defaultPressed: true } : {}),
    disabled: props.disabled || undefined,
    onPressedChange: props.onPressedChange,
  })

  const controller = useMachine(component, machine)

  return {
    service: controller.service,
    start: () => controller.start(),
    send: controller.send as MachineSend,
    connect: (state: object, send: MachineSend) => toggleConnect(state as never, normalizeProps) as ToggleApi,
  }
}
