import type { TimEvent, LogicDefinition } from '../../shared'

export type TextInputValue = string
export type TextInputType =
    | 'text'
    | 'password'
    | 'email'
    | 'number'
    | 'tel'
    | 'url'
    | 'search'
    | 'date'
    | 'time'
    | 'datetime-local'
    | 'month'
    | 'week'
    | 'color'

export type TextInputValueChangeEvent = TimEvent<{ value: TextInputValue }>

export type TextInputProps = {
    id?: string
    name?: string
    value?: TextInputValue
    defaultValue?: TextInputValue
    placeholder?: string
    disabled?: boolean
    required?: boolean
    readOnly?: boolean
    type?: TextInputType | (string & {})
    onValueChange?: (event: TextInputValueChangeEvent) => void
}
export type InputProps = TextInputProps

export type InputVueProps = Omit<TextInputProps, 'value' | 'defaultValue' | 'onValueChange'> & {
    modelValue?: string | number
    value?: string | number
    defaultValue?: string | number
}

/**
 * Input Logic Definition契约
 */
export type InputLogic = LogicDefinition<InputProps, object>
