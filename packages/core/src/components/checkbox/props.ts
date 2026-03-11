import type * as checkbox from '@zag-js/checkbox'

import type { LogicDefinition, TimEvent } from '../../shared'

export type CheckboxCheckedChangeEvent = TimEvent<{ checked: checkbox.CheckedState }>

export type CheckboxProps = Omit<checkbox.Props, 'onCheckedChange'> & {
  /**
   * Callback fired when the state of the checked property changes.
   */
  onCheckedChange?: (event: CheckboxCheckedChangeEvent) => void
}

export type CheckboxCheckedState = boolean | 'indeterminate'

export type CheckboxVueProps = {
  /**
   * A unique identifier for the component.
   */
  id?: string
  /**
   * The controlled checked state of the component.
   */
  checked?: CheckboxCheckedState
  /**
   * The default checked state of the component when initially rendered.
   */
  defaultChecked?: CheckboxCheckedState
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
   * The name of the component, used when submitting an HTML form.
   */
  name?: string
  /**
   * The controlled value of the component.
   */
  value?: string
  /**
   * The controlled value bound via `v-model` (Vue specific).
   */
  modelValue?: CheckboxCheckedState
  /**
   * Callback fired when the state of the checked property changes.
   */
  onCheckedChange?: (details: { checked: CheckboxCheckedState }) => void
}

/**
 * Checkbox Logic Definition契约
 */
export type CheckboxLogic = LogicDefinition<CheckboxProps, checkbox.Api>
