import type * as datePicker from '@zag-js/date-picker'

import type { LogicDefinition, TimEvent } from '../../shared'

export type DatePickerValueChangeEvent = TimEvent<{
  value: datePicker.DateValue[]
  valueAsString: string[]
}>

export type DatePickerProps = Omit<datePicker.Props, 'onValueChange'> & {
  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (event: DatePickerValueChangeEvent) => void
}

export type DatePickerMode = 'single' | 'range'
export type DatePickerRangeValue = { from?: Date; to?: Date } | undefined
export type DatePickerVueValue = Date | DatePickerRangeValue | undefined
export type DatePickerVueProps = {
  /**
   * The controlled value bound via `v-model` (Vue specific).
   */
  modelValue?: DatePickerVueValue
  /**
   * The default value of the component when uncontrolled.
   */
  defaultValue?: DatePickerVueValue
  /**
   * The rendering or interaction mode of the component.
   */
  mode?: DatePickerMode
  /**
   * Short hint displayed in the input before the user enters a value.
   */
  placeholder?: string
  /**
   * The number of months to display simultaneously.
   */
  numberOfMonths?: number
}

/**
 * DatePicker Logic Definition契约
 */
export type DatePickerLogic = LogicDefinition<DatePickerProps, datePicker.Api>
