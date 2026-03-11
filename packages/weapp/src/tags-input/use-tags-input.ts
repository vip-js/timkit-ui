import { tagsInputConnect, tagsInputMachine, type TagsInputApi } from '@timui/core'

import { normalizeProps, useMachine } from '../utils/machine'

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
  cleanup: () => void
  send: MachineSend
  connect: (state: object, send: MachineSend) => TagsInputApi
} {
  const machine = tagsInputMachine({
    id: props.id || 'tags-input',
    value: props.value,
    max: props.max,
    disabled: props.disabled,
    readOnly: props.readOnly,
    allowOverflow: props.allowOverflow,
    onValueChange: props.onValueChange,
  })

  const controller = useMachine(component, machine)

  return {
    service: controller.service,
    cleanup: controller.start(),
    send: controller.send as MachineSend,
    connect: (state: object, send: MachineSend) => tagsInputConnect(state, send) as TagsInputApi,
  }
}
