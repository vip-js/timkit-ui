import { tagsInputConnect, tagsInputMachine, type TagsInputApi } from '@timui/core'

import { normalizeProps, useMachine, bindMachine } from '../utils/machine'

type MachineEvent = string | { type: string; [key: string]: object }
type MachineSend = (event: MachineEvent) => void

export type UseTagsInputProps = {
  id?: string
  value?: string[]
  max?: number
  disabled?: boolean
  readOnly?: boolean
  allowOverflow?: boolean
  onValueChange?: (details: object) => void
}

export function setupTagsInputMachine(
  component: WechatMiniprogram.Component.TrivialInstance,
  props: UseTagsInputProps
): {
  service: object
  start: () => () => void
  send: MachineSend
  connect: (state: object, send: MachineSend) => TagsInputApi
} {
  const current = props.value ?? []
  const machine = bindMachine(tagsInputMachine, {
    id: props.id || 'tags-input',
    defaultValue: current,
    max: props.max,
    disabled: props.disabled || undefined,
    readOnly: props.readOnly || undefined,
    allowOverflow: props.allowOverflow,
    validate: () => true,
    onValueChange: props.onValueChange,
  })

  const controller = useMachine(component, machine)

  return {
    service: controller.service,
    start: () => controller.start(),
    send: controller.send as MachineSend,
    connect: (state: object, send: MachineSend) => tagsInputConnect(state as never, normalizeProps) as TagsInputApi,
  }
}
