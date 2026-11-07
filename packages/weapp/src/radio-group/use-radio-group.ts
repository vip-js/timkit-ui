import { radioGroupConnect, radioGroupMachine } from '@timui/core'

import { emitTimEvent } from '../utils'
import { normalizeProps, useMachine, bindMachine } from '../utils/machine'

type MachineEvent = string | { type: string; value?: string | null; isTrusted?: boolean }
type MachineSend = (event: MachineEvent) => void
type RadioGroupApi = {
  value?: string | null
  setValue?: (value: string) => void
}
type RadioGroupInstance = WechatMiniprogram.Component.TrivialInstance & {
  properties: {
    id?: string
    value?: string | null
    defaultValue?: string | null
    name?: string
    disabled?: boolean
    readOnly?: boolean
    required?: boolean
    orientation?: 'horizontal' | 'vertical'
  }
  triggerEvent: (name: string, detail?: Record<string, object>) => void
}

export function setupRadioGroupMachine(instance: RadioGroupInstance) {
  const passed = instance.properties.value
  const source = passed == null ? instance.properties.defaultValue : passed
  const machine = bindMachine(radioGroupMachine, {
    id: instance.properties.id || 'radio-group',
    ...(source ? { defaultValue: String(source) } : {}),
    name: instance.properties.name || undefined,
    disabled: instance.properties.disabled || undefined,
    readOnly: instance.properties.readOnly || undefined,
    required: instance.properties.required || undefined,
    orientation: (instance.properties.orientation || 'vertical') as 'horizontal' | 'vertical',
    onValueChange: (details: { value: string | null }) => {
      emitTimEvent(instance, 'change', 'change', instance.properties.id || 'radio-group', {
        value: details.value,
      })
    },
  })

  const controller = useMachine(instance, machine)

  return {
    service: controller.service,
    start: () => controller.start(),
    send: controller.send as MachineSend,
    connect: (state: object, _send: MachineSend) =>
      radioGroupConnect(state as never, normalizeProps) as RadioGroupApi,
  }
}
