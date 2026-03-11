import { accordionConnect, accordionMachine, type AccordionApi } from '@timui/core'

import { normalizeProps, useMachine } from '../utils/machine'

type AccordionEventPayload = string | number | boolean | string[] | number[] | null | undefined
type MachineEvent = string | { type: string; [key: string]: AccordionEventPayload }
type MachineSend = (event: MachineEvent) => void
type AccordionContextPatch = {
  value?: string[]
  multiple?: boolean
  collapsible?: boolean
  disabled?: boolean
}
type AccordionService = {
  setContext: (context: AccordionContextPatch) => void
}

export type UseAccordionProps = {
  id?: string
  value?: string[]
  multiple?: boolean
  collapsible?: boolean
  disabled?: boolean
  onValueChange?: (details: { value: string[] }) => void
}

export type AccordionMachineInstance = {
  send: (event: MachineEvent) => void
  setProps: (props: AccordionContextPatch) => void
}

export function toArray(value: string[] | string | null | undefined): string[] {
  if (Array.isArray(value)) return value
  if (typeof value === 'string' && value.length > 0) return [value]
  return []
}

export function getAccordionItemOpen(value: string[], itemValue: string): boolean {
  return value.includes(itemValue)
}

export function setupAccordionMachine(
  component: WechatMiniprogram.Component.TrivialInstance,
  props: UseAccordionProps = {}
): {
  service: AccordionService
  cleanup: () => void
  send: MachineSend
  connect: (state: { value?: string[] }, send: MachineSend) => AccordionApi
  setProps: (patch: AccordionContextPatch) => void
} {
  const machine = accordionMachine({
    id: props.id || 'accordion',
    value: props.value,
    multiple: props.multiple,
    collapsible: props.collapsible,
    disabled: props.disabled,
    onValueChange: props.onValueChange,
  })

  const controller = useMachine(component, machine)
  const service = controller.service as AccordionService
  const send = controller.send as MachineSend

  const setProps = (patch: AccordionContextPatch) => {
    service.setContext({
      value: patch.value,
      multiple: patch.multiple,
      collapsible: patch.collapsible,
      disabled: patch.disabled,
    })
  }

  return {
    service,
    cleanup: controller.start(),
    send,
    connect: (state: { value?: string[] }, machineSend: MachineSend) =>
      accordionConnect(state, machineSend, normalizeProps) as AccordionApi,
    setProps,
  }
}
