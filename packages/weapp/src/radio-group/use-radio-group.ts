import { radioGroupConnect, radioGroupMachine } from '@timui/core'

import { emitTimEvent } from '../utils'
import { normalizeProps, useMachine } from '../utils/machine'

type MachineEvent = string | { type: string; [key: string]: object }
type MachineSend = (event: MachineEvent) => void
type RadioGroupInstance = WechatMiniprogram.Component.TrivialInstance & {
  properties: {
    id?: string
    value?: string
    name?: string
    disabled?: boolean
    orientation?: 'horizontal' | 'vertical'
  }
  triggerEvent: (name: string, detail?: Record<string, object>) => void
}

export function setupRadioGroupMachine(instance: RadioGroupInstance) {
  const machine = radioGroupMachine({
    id: instance.properties.id || 'radio-group',
    value: instance.properties.value,
    name: instance.properties.name,
    disabled: instance.properties.disabled,
    orientation: instance.properties.orientation as 'horizontal' | 'vertical',
    onValueChange: (details: { value: string }) => {
      emitTimEvent(instance, 'change', 'change', instance.properties.id || 'radio-group', {
        value: details.value,
      })
    },
  })

  const controller = useMachine(instance, machine)

  return {
    controller,
    connect: (state: object, send: MachineSend) => radioGroupConnect(state, send, normalizeProps),
  }
}
