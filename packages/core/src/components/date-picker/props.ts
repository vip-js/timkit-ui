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
   * A unique identifier for the component.
   */
  id?: string
  /**
   * The controlled value of the component.
   */
  value?: DatePickerVueValue
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
  /**
   * The minimum allowed date.
   */
  minDate?: Date
  /**
   * The maximum allowed date.
   */
  maxDate?: Date
  /**
   * Callback to determine whether a given date should be marked as unselectable.
   */
  isDateUnavailable?: (date: Date) => boolean
  /**
   * BCP 47 locale used for parsing/formatting date labels.
   */
  locale?: string
  /**
   * When `true`, prevents the user from interacting with the component.
   */
  disabled?: boolean
  /**
   * When `true`, indicates that the user must provide a value before form submission.
   */
  required?: boolean
  /**
   * The name of the hidden input when used in a form.
   */
  name?: string
  /**
   * The controlled open state of the popover.
   */
  open?: boolean
  /**
   * The default open state of the popover when uncontrolled.
   */
  defaultOpen?: boolean
  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (value: DatePickerVueValue) => void
  /**
   * Callback fired when the open state changes.
   */
  onOpenChange?: (open: boolean) => void
}

/**
 * DatePicker Logic Definition契约
 */
export type DatePickerLogic = LogicDefinition<DatePickerProps, datePicker.Api>
