import type { ListCollection } from '@zag-js/collection'
import type * as combobox from '@zag-js/combobox'

import type { LogicDefinition, TimEvent } from '../../shared'

export interface ComboboxItem {
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

export type ComboboxValueChangeEvent = TimEvent<{ value: string[] }>

export type ComboboxProps = Omit<combobox.Props<ComboboxItem>, 'onValueChange'> & {
  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (event: ComboboxValueChangeEvent) => void
}

export type ComboboxVueProps = {
  /**
   * A unique identifier for the component.
   */
  id?: string
  /**
   * The items collection source for list-based components.
   */
  collection?: ListCollection<ComboboxItem>
  /**
   * The controlled value of the component.
   */
  value?: string[]
  /**
   * The default value of the component when uncontrolled.
   */
  defaultValue?: string[]
  /**
   * The controlled text value of the input.
   */
  inputValue?: string
  /**
   * The default text value of the input when uncontrolled.
   */
  defaultInputValue?: string
  /**
   * The controlled open state of the component.
   */
  open?: boolean
  /**
   * The default open state of the component when initially rendered.
   */
  defaultOpen?: boolean
  /**
   * When `true`, prevents the user from interacting with the component.
   */
  disabled?: boolean
  /**
   * When `true`, keeps the component value from being modified by the user.
   */
  readOnly?: boolean
  /**
   * The name of the component, used when submitting an HTML form.
   */
  name?: string
  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (value: string[]) => void
  onInputValueChange?: (inputValue: string) => void
  /**
   * Callback fired when the open state changes.
   */
  onOpenChange?: (open: boolean) => void
}

export type ItemProps = combobox.ItemProps
export type ItemGroupProps = combobox.ItemGroupProps
export type ItemGroupLabelProps = combobox.ItemGroupLabelProps

/**
 * Combobox Logic Definition契约
 */
export type ComboboxLogic = LogicDefinition<ComboboxProps, object>
