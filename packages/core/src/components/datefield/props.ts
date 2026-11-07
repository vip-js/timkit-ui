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
   * The controlled date value.
   */
  value?: string
  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (value: string) => void
  /**
   * The specific type or behavior subset of the component.
   */
  type?: 'date' | 'time' | 'datetime-local'
  /**
   * Controls the smallest selectable unit when editing date/time values.
   */
  granularity?: 'day' | 'minute' | 'second'
  /**
   * Preferred hour cycle for time-oriented inputs.
   */
  hourCycle?: 12 | 24
  /**
   * When `true`, strips all default visual styles from the component.
   */
  unstyled?: boolean
  /**
   * When `true`, indicates that the user input is invalid.
   */
  invalid?: boolean
  /**
   * When true, the field stays focusable and date changes are ignored.
   */
  readOnly?: boolean
}

/**
 * DateField Logic Definition契约
 */
export type DateFieldLogic = LogicDefinition<DateFieldProps, datePicker.Api>
