import type * as switch_ from '@zag-js/switch'

import type { LogicDefinition, TimEvent } from '../../shared'

export type SwitchCheckedChangeEvent = TimEvent<{ checked: boolean }>

export type SwitchProps = Omit<switch_.Props, 'onCheckedChange'> & {
  /**
   * Callback fired when the state of the checked property changes.
   */
  onCheckedChange?: (event: SwitchCheckedChangeEvent) => void
}

export type SwitchVueProps = {
  /**
   * A unique identifier for the component.
   */
  id?: string
  /**
   * The controlled checked state of the component.
   */
  checked?: boolean
  /**
   * The default checked state of the component when initially rendered.
   */
  defaultChecked?: boolean
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
   * The controlled value of the component.
   */
  value?: string
  /**
   * The controlled value bound via `v-model` (Vue specific).
   */
  modelValue?: boolean
  /**
   * Callback fired when the state of the checked property changes.
   */
  onCheckedChange?: (details: { checked: boolean }) => void
}

/**
 * Switch Logic Definition契约
 */
export type SwitchLogic = LogicDefinition<SwitchProps, switch_.Api>
