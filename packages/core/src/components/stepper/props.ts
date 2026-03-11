import type * as numberInput from '@zag-js/number-input'

import type { LogicDefinition, TimEvent } from '../../shared'

export type StepperOrientation = 'horizontal' | 'vertical'

export type StepperValueChangeEvent = TimEvent<{ value: string; valueAsNumber: number }>

export type StepperProps = Omit<numberInput.Props, 'onValueChange'> & {
  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (event: StepperValueChangeEvent) => void
  /**
   * The orientation of the component.
   */
  orientation?: StepperOrientation
}

/**
 * Stepper Logic Definition契约
 */
export type StepperLogic = LogicDefinition<StepperProps, numberInput.Api>
