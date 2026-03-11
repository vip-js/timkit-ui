import { toggleConnect, toggleMachine, type ToggleApi } from '@timui/core'

import { normalizeProps, useMachine } from '../utils/machine'

type MachineEvent = string | { type: string; [key: string]: object }
type MachineSend = (event: MachineEvent) => void

export type UseToggleProps = {
  id?: string
  pressed?: boolean
  disabled?: boolean
  onPressedChange?: (details: { pressed: boolean }) => void
}

export function setupToggleMachine(
  component: WechatMiniprogram.Component.TrivialInstance,
  props: UseToggleProps
): {
  service: object
  cleanup: () => void
  send: MachineSend
  connect: (state: object, send: MachineSend) => ToggleApi
} {
  const machine = toggleMachine({
    id: props.id || 'toggle',
    pressed: props.pressed,
    disabled: props.disabled,
    onPressedChange: props.onPressedChange,
  })

  const controller = useMachine(component, machine)

  return {
    service: controller.service,
    cleanup: controller.start(),
    send: controller.send as MachineSend,
    connect: (state: object, send: MachineSend) => toggleConnect(state, send) as ToggleApi,
  }
}
