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

export type CalendarMode = 'single' | 'range' | 'multiple'
export type CalendarRangeValue = { from?: Date; to?: Date } | undefined
export type CalendarDisabledMatcher =
  | Date
  | {
      before?: Date
      after?: Date
      from?: Date
      to?: Date
      dayOfWeek?: number[]
    }
  | ((date: Date) => boolean)

export type CalendarVueValue = Date | Date[] | CalendarRangeValue | undefined
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
   * The controlled display month.
   */
  month?: Date
  /**
   * The default display month for uncontrolled usage.
   */
  defaultMonth?: Date
  /**
   * Callback fired when the visible month changes.
   */
  onMonthChange?: (month: Date) => void
  /**
   * The earliest month that can be navigated to.
   */
  startMonth?: Date
  /**
   * The latest month that can be navigated to.
   */
  endMonth?: Date
  /**
   * Enables paged navigation by month groups.
   */
  pagedNavigation?: boolean
  /**
   * Controls the caption layout.
   */
  captionLayout?: 'label' | 'dropdown' | 'dropdown-years'
  /**
   * Hides previous/next navigation controls.
   */
  hideNavigation?: boolean
  /**
   * Renders a fixed number of weeks.
   */
  fixedWeeks?: boolean
  /**
   * Shows week numbers.
   */
  showWeekNumber?: boolean
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
   * When boolean, disables the entire component. Otherwise, marks matching dates as unavailable.
   */
  disabled?: boolean | CalendarDisabledMatcher | CalendarDisabledMatcher[]
  /**
   * When `true`, range selection excludes spans that include unavailable dates.
   */
  excludeDisabled?: boolean
  /**
   * Callback to determine whether a given date should be marked as unselectable.
   */
  isDateUnavailable?: (date: Date) => boolean
}

/**
 * Calendar Logic Definition契约
 */
export type CalendarLogic = LogicDefinition<CalendarProps, calendar.Api>
