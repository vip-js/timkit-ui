import type * as numberInput from '@zag-js/number-input'

import type { LogicDefinition, TimEvent } from '../../shared'

export type NumberFieldValueChangeEvent = TimEvent<{ value: string; valueAsNumber: number }>

export type NumberFieldProps = Omit<numberInput.Props, 'id' | 'onValueChange'> & {
  id?: string
  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (event: NumberFieldValueChangeEvent) => void
}

/**
 * NumberField Logic Definition契约
 */
export type NumberFieldLogic = LogicDefinition<NumberFieldProps, numberInput.Api>
