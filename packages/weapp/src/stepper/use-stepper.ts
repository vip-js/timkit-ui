import { stepperConnect, stepperMachine, type StepperApi } from '@timui/core'

import { useMachine } from '../utils/machine'

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

export function setupStepperMachine(
  component: WechatMiniprogram.Component.TrivialInstance,
  props: UseStepperProps
): {
  service: object
  cleanup: () => void
  send: MachineSend
  connect: (state: object, send: MachineSend) => StepperApi
} {
  const machine = stepperMachine({
    id: props.id || 'stepper',
    value: props.value,
    min: props.min,
    max: props.max,
    step: props.step,
    disabled: props.disabled,
    readOnly: props.readOnly,
    allowMouseWheel: props.allowMouseWheel,
    clampValueOnBlur: props.clampValueOnBlur,
    onValueChange: props.onValueChange,
  })

  const controller = useMachine(component, machine)

  return {
    service: controller.service,
    cleanup: controller.start(),
    send: controller.send as MachineSend,
    connect: (state: object, send: MachineSend) => stepperConnect(state, send) as StepperApi,
  }
}
