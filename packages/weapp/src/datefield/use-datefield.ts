import { dateFieldConnect, dateFieldMachine, type DateFieldApi } from '@timui/core'

import { normalizeProps, useMachine, bindMachine } from '../utils/machine'

type MachineEvent = string | { type: string; [key: string]: object }
type MachineSend = (event: MachineEvent) => void

export type UseDateFieldProps = {
  id?: string
  value?: string[]
  min?: string[]
  max?: string[]
  disabled?: boolean
  onValueChange?: (details: object) => void
}

export function setupDateFieldMachine(
  component: WechatMiniprogram.Component.TrivialInstance,
  props: UseDateFieldProps
): {
  service: object
  start: () => () => void
  send: MachineSend
  connect: (state: object, send: MachineSend) => DateFieldApi
} {
  const rawValue = props.value ?? []
  const machineValue = rawValue.some((item) => typeof item === 'string') ? undefined : rawValue
  const machine = bindMachine(dateFieldMachine, {
    id: props.id || 'datefield',
    ...(machineValue && machineValue.length > 0 ? { value: machineValue } : {}),
    min: props.min,
    max: props.max,
    disabled: props.disabled,
    onValueChange: props.onValueChange,
  })

  const controller = useMachine(component, machine)

  return {
    service: controller.service,
    start: () => controller.start(),
    send: controller.send as MachineSend,
    connect: (state: object, send: MachineSend) => dateFieldConnect(state as never, normalizeProps) as DateFieldApi,
  }
}
