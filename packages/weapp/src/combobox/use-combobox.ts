import { comboboxCollection, comboboxConnect, comboboxMachine } from '@timui/core'

import { normalizeProps, useMachine } from '../utils/machine'

type ComboboxItemRecord = Record<string, object>

export type WeappComboboxApi = {
  triggerProps?: { onClick?: () => void }
  selectValue?: (value: string) => void
  setOpen?: (open: boolean) => void
}

export type WeappComboboxService = {
  setContext: (context: Record<string, object>) => void
}

type MachineSend = (event: string | { type: string; [key: string]: object }) => void
type WeappComboboxComponent = WechatMiniprogram.Component.TrivialInstance

export type WeappComboboxContext = {
  id: string
  collection: object
  value: string[]
  name: string
  disabled: boolean
  readOnly: boolean
  onValueChange?: (details: { value: string[] }) => void
}

export function setupComboboxMachine(
  component: WeappComboboxComponent,
  context: WeappComboboxContext
) {
  const machine = comboboxMachine({
    id: context.id,
    collection: context.collection,
    value: context.value,
    name: context.name,
    disabled: context.disabled,
    readOnly: context.readOnly,
    openOnClick: true,
    inputBehavior: 'none',
    selectionBehavior: 'replace',
    onValueChange: context.onValueChange,
  })

  const controller = useMachine(component, machine)
  const service = controller.service as WeappComboboxService
  const cleanup = controller.start()
  const send = controller.send as MachineSend

  return { service, cleanup, send }
}

export function connectComboboxMachine(state: object, send: MachineSend) {
  return comboboxConnect(state, send, normalizeProps) as WeappComboboxApi
}
