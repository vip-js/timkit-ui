import type * as calendar from '@zag-js/date-picker'

import type { LogicDefinition, TimEvent } from '../../shared'

export type CalendarValueChangeEvent = TimEvent<{
  value: calendar.DateValue[]
  valueAsString: string[]
}>

export type CalendarProps = Omit<calendar.Props, 'onValueChange'> & {
  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (event: CalendarValueChangeEvent) => void
}

export type CalendarMode = 'single' | 'range'
export type CalendarRangeValue = { from?: Date; to?: Date } | undefined
export type CalendarVueValue = Date | CalendarRangeValue | undefined
export type CalendarVueProps = {
  /**
   * The controlled value bound via `v-model` (Vue specific).
   */
  modelValue?: CalendarVueValue
  /**
   * The default value of the component when uncontrolled.
   */
  defaultValue?: CalendarVueValue
  /**
   * The rendering or interaction mode of the component.
   */
  mode?: CalendarMode
  /**
   * When `true`, displays dates from the previous and next months that fall in the calendar grid.
   */
  showOutsideDays?: boolean
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
   * When `true`, prevents the user from interacting with the component.
   */
  disabled?: boolean
  /**
   * Callback to determine whether a given date should be marked as unselectable.
   */
  isDateUnavailable?: (date: Date) => boolean
}

/**
 * Calendar Logic Definition契约
 */
export type CalendarLogic = LogicDefinition<CalendarProps, calendar.Api>
