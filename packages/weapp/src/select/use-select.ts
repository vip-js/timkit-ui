import { selectCollection, selectConnect, selectMachine } from '@timui/core'

import { normalizeProps, useMachine } from '../utils/machine'

type SelectItemRecord = Record<string, object>

export type WeappSelectApi = {
  triggerProps?: { onClick?: () => void }
  selectValue?: (value: string) => void
  setOpen?: (open: boolean) => void
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
  onValueChange?: (details: { value: string[] }) => void
}

export function setupSelectMachine(component: WeappSelectComponent, context: WeappSelectContext) {
  const machine = selectMachine({
    id: context.id,
    collection: context.collection,
    value: context.value,
    name: context.name,
    disabled: context.disabled,
    positioning: { placement: 'bottom' },
    onValueChange: context.onValueChange,
  })

  const controller = useMachine(component, machine)
  const service = controller.service as WeappSelectService
  const cleanup = controller.start()
  const send = controller.send as MachineSend

  return { service, cleanup, send }
}

export function connectSelectMachine(state: object, send: MachineSend) {
  return selectConnect(state, send, normalizeProps) as WeappSelectApi
}
