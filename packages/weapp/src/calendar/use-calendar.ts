import { calendarConnect, calendarMachine } from '@timui/core'

import { normalizeProps, useMachine, bindMachine } from '../utils/machine'

type MachineEvent = string | { type: string; [key: string]: object }
type MachineSend = (event: MachineEvent) => void
type CalendarInstance = WechatMiniprogram.Component.TrivialInstance & {
  properties: {
    id?: string
    mode?: string
    numberOfMonths?: number
    disabled?: boolean
    readOnly?: boolean
  }
}

export function setupCalendarMachine(instance: CalendarInstance) {
  const machine = bindMachine(calendarMachine, {
    id: instance.properties.id || 'calendar',
    inline: true,
    selectionMode: instance.properties.mode || 'single',
    numOfMonths: instance.properties.numberOfMonths || 1,
    disabled: instance.properties.disabled || undefined,
    readOnly: instance.properties.readOnly || undefined,
    closeOnSelect: false,
  })
  const controller = useMachine(instance, machine)
  return {
    controller,
    connect: (state: object, send: MachineSend) => calendarConnect(state as never, normalizeProps),
  }
}
