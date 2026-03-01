import type * as calendar from '@zag-js/date-picker'
import type { TimEvent, LogicDefinition } from '../../shared'

export type CalendarValueChangeEvent = TimEvent<{ value: calendar.DateValue[], valueAsString: string[] }>

export type CalendarProps = Omit<calendar.Props, 'onValueChange'> & {
    onValueChange?: (event: CalendarValueChangeEvent) => void
}

export type CalendarMode = 'single' | 'range'
export type CalendarRangeValue = { from?: Date; to?: Date } | undefined
export type CalendarVueValue = Date | CalendarRangeValue | undefined
export type CalendarVueProps = {
    modelValue?: CalendarVueValue
    defaultValue?: CalendarVueValue
    mode?: CalendarMode
    showOutsideDays?: boolean
    numberOfMonths?: number
    minDate?: Date
    maxDate?: Date
    disabled?: boolean
    isDateUnavailable?: (date: Date) => boolean
}

/**
 * Calendar Logic Definition契约
 */
export type CalendarLogic = LogicDefinition<CalendarProps, calendar.Api>
