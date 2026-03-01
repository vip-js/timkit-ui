import type * as numberInput from '@zag-js/number-input'
import type { TimEvent, LogicDefinition } from '../../shared'

export type StepperOrientation = 'horizontal' | 'vertical'

export type StepperValueChangeEvent = TimEvent<{ value: string; valueAsNumber: number }>

export type StepperProps = Omit<numberInput.Props, 'onValueChange'> & {
    onValueChange?: (event: StepperValueChangeEvent) => void
    orientation?: StepperOrientation
}

/**
 * Stepper Logic Definition契约
 */
export type StepperLogic = LogicDefinition<StepperProps, numberInput.Api>
