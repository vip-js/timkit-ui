import { datePickerConnect, datePickerMachine } from '@timui/core'

import { normalizeProps, useMachine, bindMachine } from '../utils/machine'

type MachineEvent = string | { type: string; [key: string]: object }
type MachineSend = (event: MachineEvent) => void
type DatePickerInstance = WechatMiniprogram.Component.TrivialInstance & {
  properties: {
    id?: string
    mode?: string
    numberOfMonths?: number
    disabled?: boolean
    required?: boolean
    open?: boolean | null
    defaultOpen?: boolean | null
  }
}

export function setupDatePickerMachine(instance: DatePickerInstance) {
  const machine = bindMachine(datePickerMachine, {
    id: instance.properties.id || 'date-picker',
    selectionMode: instance.properties.mode || 'single',
    numOfMonths: instance.properties.numberOfMonths || 1,
    disabled: instance.properties.disabled || undefined,
    required: instance.properties.required || undefined,
    defaultOpen: (instance.properties.open == null
      ? instance.properties.defaultOpen
      : instance.properties.open) === true
      ? true
      : undefined,
    closeOnSelect: false,
  })
  const controller = useMachine(instance, machine)
  return {
    controller,
    connect: (state: object, send: MachineSend) => datePickerConnect(state as never, normalizeProps),
  }
}
