import type { ListCollection } from '@zag-js/collection'
import type * as select from '@zag-js/select'

import type { LogicDefinition, TimEvent } from '../../shared'

export interface ListBoxItem {
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

export type ListBoxValue = string | string[] | undefined
export type ListBoxValueChangeEvent = TimEvent<{ value: string[] }>

export type ListBoxProps = Omit<select.Props<ListBoxItem>, 'onValueChange'> & {
  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (event: ListBoxValueChangeEvent) => void
}

export type ListBoxVueProps = {
  /**
   * A unique identifier for the component.
   */
  id?: string
  /**
   * The items collection source for list-based components.
   */
  collection?: ListCollection<ListBoxItem>
  /**
   * The controlled value of the component.
   */
  value?: ListBoxValue
  /**
   * The controlled value bound via `v-model` (Vue specific).
   */
  modelValue?: ListBoxValue
  /**
   * The default value of the component when uncontrolled.
   */
  defaultValue?: ListBoxValue
  /**
   * Selection mode.
   */
  selectionMode?: 'single' | 'multiple'
  /**
   * When `true`, prevents the user from interacting with the component.
   */
  disabled?: boolean
  /**
   * When `true`, indicates that the user must specify a value before form submit.
   */
  required?: boolean
  /**
   * The name of the component, used when submitting an HTML form.
   */
  name?: string
  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (value?: ListBoxValue) => void
}

/**
 * ListBox Logic Definition contract.
 */
export type ListBoxLogic = LogicDefinition<ListBoxProps, object>
