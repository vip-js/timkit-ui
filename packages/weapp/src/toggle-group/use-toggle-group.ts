import { toggleGroupConnect, toggleGroupMachine, type ToggleGroupApi } from '@timui/core'

import { normalizeProps, useMachine } from '../utils/machine'

type MachineEvent = string | { type: string; [key: string]: object }
type MachineSend = (event: MachineEvent) => void

export type UseToggleGroupProps = {
  id?: string
  value?: string[]
  multiple?: boolean
  disabled?: boolean
  loop?: boolean
  onValueChange?: (details: object) => void
}

export function setupToggleGroupMachine(
  component: WechatMiniprogram.Component.TrivialInstance,
  props: UseToggleGroupProps
): {
  service: object
  cleanup: () => void
  send: MachineSend
  connect: (state: object, send: MachineSend) => ToggleGroupApi
} {
  const machine = toggleGroupMachine({
    id: props.id || 'toggle-group',
    value: props.value,
    multiple: props.multiple,
    disabled: props.disabled,
    loop: props.loop,
    onValueChange: props.onValueChange,
  })

  const controller = useMachine(component, machine)

  return {
    service: controller.service,
    cleanup: controller.start(),
    send: controller.send as MachineSend,
    connect: (state: object, send: MachineSend) =>
      toggleGroupConnect(state, send) as ToggleGroupApi,
  }
}
