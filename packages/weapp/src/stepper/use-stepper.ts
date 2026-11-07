import { stepperConnect, stepperMachine, type StepperApi } from '@timui/core'

import { normalizeProps, useMachine, bindMachine } from '../utils/machine'

type MachineEvent = string | { type: string; [key: string]: object }
type MachineSend = (event: MachineEvent) => void

export type UseStepperProps = {
  id?: string
  value?: string
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  readOnly?: boolean
  allowMouseWheel?: boolean
  clampValueOnBlur?: boolean
  onValueChange?: (details: object) => void
}

export function stepperStartValue(value: unknown, fallback?: unknown) {
  const source = value == null ? fallback : value
  if (source == null || source === '') return undefined
  return String(source)
}

export function setupStepperMachine(
  component: WechatMiniprogram.Component.TrivialInstance,
  props: UseStepperProps
): {
  service: object
  start: () => () => void
  send: MachineSend
  connect: (state: object, send: MachineSend) => StepperApi
} {
  const machine = bindMachine(stepperMachine, {
    id: props.id || 'stepper',
    defaultValue: props.value == null || props.value === '' ? '0' : String(props.value),
    min: props.min,
    max: props.max,
    step: props.step,
    disabled: props.disabled || undefined,
    readOnly: props.readOnly || undefined,
    allowMouseWheel: props.allowMouseWheel,
    clampValueOnBlur: props.clampValueOnBlur,
    focusInputOnChange: false,
    onValueChange: props.onValueChange,
  })

  const controller = useMachine(component, machine)

  return {
    service: controller.service,
    start: () => controller.start(),
    send: controller.send as MachineSend,
    connect: (state: object, send: MachineSend) => stepperConnect(state as never, normalizeProps) as StepperApi,
  }
}
