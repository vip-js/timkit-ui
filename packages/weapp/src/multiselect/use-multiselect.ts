import { selectConnect, selectMachine, type SelectApi } from '@timui/core'

import { normalizeProps, useMachine, bindMachine } from '../utils/machine'

type MachineEvent = string | { type: string; [key: string]: object }
type MachineSend = (event: MachineEvent) => void

export type UseMultiselectProps = {
  id?: string
  collection: object
  value?: string[]
  name?: string
  disabled?: boolean
  multiple?: boolean
  open?: boolean | null
  defaultOpen?: boolean | null
  onValueChange?: (details: object) => void
}

export function setupMultiselectMachine(
  component: WechatMiniprogram.Component.TrivialInstance,
  props: UseMultiselectProps
): {
  service: object
  start: () => () => void
  send: MachineSend
  connect: (state: object, send: MachineSend) => SelectApi
} {
  const current = props.value ?? []
  const machine = bindMachine(selectMachine, {
    id: props.id || 'multiselect',
    collection: props.collection,
    ...(current.length ? { defaultValue: current } : {}),
    name: props.name || undefined,
    disabled: props.disabled || undefined,
    multiple: props.multiple ?? true,
    ...(props.open != null
      ? { open: props.open === true }
      : props.defaultOpen === true
        ? { defaultOpen: true }
        : {}),
    positioning: { placement: 'bottom' },
    onValueChange: props.onValueChange,
  })

  const controller = useMachine(component, machine)

  return {
    service: controller.service,
    start: () => controller.start(),
    send: controller.send as MachineSend,
    connect: (state: object, send: MachineSend) => selectConnect(state as never, normalizeProps) as SelectApi,
  }
}
