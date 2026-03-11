import type { ListCollection } from '@zag-js/collection'
import type * as select from '@zag-js/select'

import type { LogicDefinition, TimEvent } from '../../shared'

export interface SelectItem {
  /**
   * The text label displayed alongside or within the component.
   */
  label: string
  /**
   * The controlled value of the component.
   */
  value: string
  /**
   * When `true`, prevents the user from interacting with the component.
   */
  disabled?: boolean
}

export type SelectValueChangeEvent = TimEvent<{ value: string[] }>

export type SelectProps = Omit<select.Props<SelectItem>, 'onValueChange'> & {
  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (event: SelectValueChangeEvent) => void
}

export type SelectVueProps = {
  /**
   * A unique identifier for the component.
   */
  id?: string
  /**
   * The items collection source for list-based components.
   */
  collection?: ListCollection<SelectItem>
  /**
   * The controlled value of the component.
   */
  value?: string
  /**
   * The default value of the component when uncontrolled.
   */
  defaultValue?: string
  /**
   * The controlled value bound via `v-model` (Vue specific).
   */
  modelValue?: string
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
   * The controlled open state of the component.
   */
  open?: boolean
  /**
   * The default open state of the component when initially rendered.
   */
  defaultOpen?: boolean
  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (details: { value: string[] }) => void
  /**
   * Callback fired when the open state changes.
   */
  onOpenChange?: (details: { open: boolean }) => void
}

/**
 * Select Logic Definition契约
 */
export type SelectLogic = LogicDefinition<SelectProps, object>
