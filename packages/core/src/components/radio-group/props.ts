import type * as radioGroup from '@zag-js/radio-group'

import type { LogicDefinition, TimEvent } from '../../shared'

export type RadioGroupValueChangeEvent = TimEvent<{ value: string | null }>

export type RadioGroupProps = Omit<radioGroup.Props, 'onValueChange'> & {
  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (event: RadioGroupValueChangeEvent) => void
}

export type RadioGroupVueProps = {
  /**
   * A unique identifier for the component.
   */
  id?: string
  /**
   * The controlled value of the component.
   */
  value?: string | null
  /**
   * The default value of the component when uncontrolled.
   */
  defaultValue?: string | null
  /**
   * When `true`, prevents the user from interacting with the component.
   */
  disabled?: boolean
  /**
   * When `true`, indicates that the user must specify a value for the input before the form can be submitted.
   */
  required?: boolean
  /**
   * The name of the component, used when submitting an HTML form.
   */
  name?: string
  /**
   * The controlled value bound via `v-model` (Vue specific).
   */
  modelValue?: string | null
  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (value: string | null) => void
}

export type RadioGroupItemProps = radioGroup.ItemProps

/**
 * RadioGroup Logic Definition契约
 */
export type RadioGroupLogic = LogicDefinition<RadioGroupProps, radioGroup.Api>
