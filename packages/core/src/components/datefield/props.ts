import type * as datePicker from '@zag-js/date-picker'

import type { LogicDefinition, TimEvent } from '../../shared'

export type DateFieldValueChangeEvent = TimEvent<{
  value: datePicker.DateValue[]
  valueAsString: string[]
}>

export type DateFieldProps = Omit<datePicker.Props, 'onValueChange'> & {
  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (event: DateFieldValueChangeEvent) => void
}

export type DateFieldVueProps = {
  /**
   * The controlled value bound via `v-model` (Vue specific).
   */
  modelValue?: string
  /**
   * The specific type or behavior subset of the component.
   */
  type?: 'date' | 'time'
  /**
   * When `true`, strips all default visual styles from the component.
   */
  unstyled?: boolean
  /**
   * When `true`, indicates that the user input is invalid.
   */
  invalid?: boolean
}

/**
 * DateField Logic Definition契约
 */
export type DateFieldLogic = LogicDefinition<DateFieldProps, datePicker.Api>
