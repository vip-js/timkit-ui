import { checkboxConnect, checkboxMachine } from '@timui/core'

import { emitTimEvent } from '../utils'
import { normalizeProps, useMachine, bindMachine } from '../utils/machine'

type MachineEvent = string | { type: string; [key: string]: object }
type MachineSend = (event: MachineEvent) => void
type CheckboxInstance = WechatMiniprogram.Component.TrivialInstance & {
  properties: {
    checked?: boolean | 'indeterminate' | null
    defaultChecked?: boolean | 'indeterminate' | null
    disabled?: boolean
    required?: boolean
    readOnly?: boolean
    value?: string
    name?: string
    id?: string
  }
  triggerEvent: (name: string, detail?: Record<string, object>) => void
}

export function setupCheckboxMachine(instance: CheckboxInstance) {
  const { checked, defaultChecked, disabled, required, readOnly, value, name, id } = instance.properties
  const initial = checked == null ? defaultChecked : checked

  const machine = bindMachine(checkboxMachine, {
    id: id || 'checkbox',
    name,
    value,
    disabled,
    required,
    readOnly,
    defaultChecked: initial === 'indeterminate' ? 'indeterminate' : !!initial,
    onCheckedChange: (details) => {
      instance.triggerEvent('input', { value: details.checked })
      emitTimEvent(instance, 'change', 'change', id || 'checkbox', {
        checked: !!details.checked,
      })
    },
  })

  const controller = useMachine(instance, machine)

  return {
    controller,
    connect: (state: object, send: MachineSend) => checkboxConnect(state as never, normalizeProps),
  }
}
