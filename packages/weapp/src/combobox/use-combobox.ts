import { comboboxCollection, comboboxConnect, comboboxMachine } from '@timui/core'

import { normalizeProps, useMachine, bindMachine } from '../utils/machine'

type ComboboxItemRecord = Record<string, object>

export type WeappComboboxApi = {
  value?: string[]
  triggerProps?: { onClick?: () => void }
  selectValue?: (value: string) => void
  setOpen?: (open: boolean) => void
  setValue?: (value: string[]) => void
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
  open?: boolean | null
  defaultOpen?: boolean | null
  onValueChange?: (details: { value: string[] }) => void
}

export function setupComboboxMachine(
  component: WeappComboboxComponent,
  context: WeappComboboxContext
) {
  const current = context.value ?? []
  const machine = bindMachine(comboboxMachine, {
    id: context.id,
    collection: context.collection,
    ...(current.length ? { defaultValue: current } : {}),
    name: context.name || undefined,
    disabled: context.disabled || undefined,
    readOnly: context.readOnly || undefined,
    ...(context.open != null
      ? { open: context.open === true }
      : context.defaultOpen === true
        ? { defaultOpen: true }
        : {}),
    openOnClick: true,
    inputBehavior: 'none',
    selectionBehavior: 'replace',
    onValueChange: context.onValueChange,
  })

  const controller = useMachine(component, machine)
  const service = controller.service as WeappComboboxService
  const send = controller.send as MachineSend

  return { service, start: () => controller.start(), send }
}

export function connectComboboxMachine(state: object, send: MachineSend) {
  return comboboxConnect(state as never, normalizeProps) as WeappComboboxApi
}
