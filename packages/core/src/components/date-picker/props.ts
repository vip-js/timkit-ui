import type * as datePicker from '@zag-js/date-picker'
import type { TimEvent, LogicDefinition } from '../../shared'

export type DatePickerValueChangeEvent = TimEvent<{ value: datePicker.DateValue[], valueAsString: string[] }>

export type DatePickerProps = Omit<datePicker.Props, 'onValueChange'> & {
    onValueChange?: (event: DatePickerValueChangeEvent) => void
}

export type DatePickerMode = 'single' | 'range'
export type DatePickerRangeValue = { from?: Date; to?: Date } | undefined
export type DatePickerVueValue = Date | DatePickerRangeValue | undefined
export type DatePickerVueProps = {
    modelValue?: DatePickerVueValue
    defaultValue?: DatePickerVueValue
    mode?: DatePickerMode
    placeholder?: string
    numberOfMonths?: number
}

/**
 * DatePicker Logic Definition契约
 */
export type DatePickerLogic = LogicDefinition<DatePickerProps, datePicker.Api>
