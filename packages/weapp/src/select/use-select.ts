import { selectCollection, selectConnect, selectMachine } from '@timui/core'

import { normalizeProps, useMachine, bindMachine } from '../utils/machine'

type SelectItemRecord = Record<string, object>

export type WeappSelectApi = {
  triggerProps?: { onClick?: () => void }
  selectValue?: (value: string) => void
  setOpen?: (open: boolean) => void
  setValue?: (value: string[]) => void
  value?: string[]
}

export type WeappSelectService = {
  setContext: (context: Record<string, object>) => void
}

type MachineSend = (event: string | { type: string; [key: string]: object }) => void
type WeappSelectComponent = WechatMiniprogram.Component.TrivialInstance

export type WeappSelectContext = {
  id: string
  collection: object
  value: string[]
  name: string
  disabled: boolean
  readOnly?: boolean
  required?: boolean
  open?: boolean | null
  defaultOpen?: boolean | null
  onValueChange?: (details: { value: string[] }) => void
}

export function setupSelectMachine(component: WeappSelectComponent, context: WeappSelectContext) {
  const selected = Array.isArray(context.value) ? context.value.filter(Boolean) : []
  const controlledOpen = context.open != null
  const machine = bindMachine(selectMachine, {
    id: context.id,
    collection: context.collection,
    ...(selected.length > 0 ? { defaultValue: selected } : {}),
    name: context.name,
    disabled: context.disabled,
    readOnly: context.readOnly || undefined,
    required: context.required || undefined,
    ...(controlledOpen
      ? { open: context.open === true }
      : context.defaultOpen === true
        ? { defaultOpen: true }
        : {}),
    positioning: { placement: 'bottom' },
    onValueChange: context.onValueChange,
  })

  const controller = useMachine(component, machine)
  const service = controller.service as WeappSelectService
  const send = controller.send as MachineSend

  return { service, start: () => controller.start(), send }
}

export function connectSelectMachine(state: object, send: MachineSend) {
  return selectConnect(state as never, normalizeProps) as WeappSelectApi
}
