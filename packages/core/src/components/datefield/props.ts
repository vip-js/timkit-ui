import type * as datePicker from '@zag-js/date-picker'
import type { TimEvent, LogicDefinition } from '../../shared'

export type DateFieldValueChangeEvent = TimEvent<{ value: datePicker.DateValue[], valueAsString: string[] }>

export type DateFieldProps = Omit<datePicker.Props, 'onValueChange'> & {
    onValueChange?: (event: DateFieldValueChangeEvent) => void
}

export type DateFieldVueProps = {
    modelValue?: string
    type?: 'date' | 'time'
    unstyled?: boolean
    invalid?: boolean
}

/**
 * DateField Logic Definition契约
 */
export type DateFieldLogic = LogicDefinition<DateFieldProps, datePicker.Api>
