import type { LogicDefinition, TimEvent } from '../../shared'

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
  /**
   * A unique identifier for the component.
   */
  id?: string
  /**
   * The name of the component, used when submitting an HTML form.
   */
  name?: string
  /**
   * The controlled value of the component.
   */
  value?: TextInputValue
  /**
   * The default value of the component when uncontrolled.
   */
  defaultValue?: TextInputValue
  /**
   * Short hint displayed in the input before the user enters a value.
   */
  placeholder?: string
  /**
   * When `true`, prevents the user from interacting with the component.
   */
  disabled?: boolean
  /**
   * When `true`, indicates that the user must specify a value for the input before the form can be submitted.
   */
  required?: boolean
  /**
   * When `true`, keeps the component value from being modified by the user.
   */
  readOnly?: boolean
  /**
   * The specific type or behavior subset of the component.
   */
  type?: TextInputType | (string & {})
  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (event: TextInputValueChangeEvent) => void
}
export type InputProps = TextInputProps

export type InputVueProps = Omit<TextInputProps, 'value' | 'defaultValue'> & {
  /**
   * The controlled value bound via `v-model` (Vue specific).
   */
  modelValue?: string | number
  /**
   * The controlled value of the component.
   */
  value?: string | number
  /**
   * The default value of the component when uncontrolled.
   */
  defaultValue?: string | number
}

/**
 * Input Logic Definition契约
 */
export type InputLogic = LogicDefinition<InputProps, object>
