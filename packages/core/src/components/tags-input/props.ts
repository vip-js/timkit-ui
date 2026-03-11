import type * as tagsInput from '@zag-js/tags-input'

import type { LogicDefinition, TimEvent } from '../../shared'

export type TagsInputValueChangeEvent = TimEvent<{ value: string[] }>

export type TagsInputProps = Omit<tagsInput.Props, 'onValueChange'> & {
  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (event: TagsInputValueChangeEvent) => void
}

export type TagsInputVueProps = {
  /**
   * A unique identifier for the component.
   */
  id?: string
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
   * The controlled value bound via `v-model` (Vue specific).
   */
  modelValue?: string[]
  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (details: { value: string[] }) => void
  onInputValueChange?: (details: { inputValue: string }) => void
}

/**
 * TagsInput Logic Definition契约
 */
export type TagsInputLogic = LogicDefinition<TagsInputProps, tagsInput.Api>
