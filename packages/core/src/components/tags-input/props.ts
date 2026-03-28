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
   * The ids of the elements in the tags input.
   */
  ids?: tagsInput.ElementIds
  /**
   * The writing direction of the component.
   */
  dir?: 'ltr' | 'rtl'
  /**
   * The locale used for localization.
   */
  locale?: string
  /**
   * The translated accessibility labels.
   */
  translations?: tagsInput.IntlTranslations
  /**
   * The max length of the input.
   */
  maxLength?: number
  /**
   * The delimiter used to split tags.
   */
  delimiter?: string | RegExp
  /**
   * Whether the input should autofocus.
   */
  autoFocus?: boolean
  /**
   * Whether the tags input should be disabled.
   */
  disabled?: boolean
  /**
   * Whether the tags input should be read-only.
   */
  readOnly?: boolean
  /**
   * Whether the tags input is invalid.
   */
  invalid?: boolean
  /**
   * Whether the tags input is required.
   */
  required?: boolean
  /**
   * Whether tags can be edited.
   */
  editable?: boolean
  /**
   * The controlled value of the input text.
   */
  inputValue?: string
  /**
   * The initial value of the input text.
   */
  defaultInputValue?: string
  /**
   * The controlled value of tags.
   */
  value?: string[]
  /**
   * The initial value of tags.
   */
  defaultValue?: string[]
  /**
   * The controlled value bound via `v-model` (Vue specific).
   */
  modelValue?: string[]
  /**
   * The behavior of the input on blur.
   */
  blurBehavior?: 'clear' | 'add'
  /**
   * Whether to add tags when pasting.
   */
  addOnPaste?: boolean
  /**
   * The max number of tags.
   */
  max?: number
  /**
   * Whether to allow tags to exceed max.
   */
  allowOverflow?: boolean
  /**
   * The name of the hidden input.
   */
  name?: string
  /**
   * The associated form id.
   */
  form?: string
  /**
   * The placeholder text for the input.
   */
  placeholder?: string
  /**
   * Callback fired to validate a tag.
   */
  validate?: (details: tagsInput.ValidateArgs) => boolean
  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (value: string[]) => void
  /**
   * Callback fired when the input value changes.
   */
  onInputValueChange?: (inputValue: string) => void
  /**
   * Callback fired when highlighted tag changes.
   */
  onHighlightChange?: (details: tagsInput.HighlightChangeDetails) => void
  /**
   * Callback fired when the value is invalid.
   */
  onValueInvalid?: (details: tagsInput.ValidityChangeDetails) => void
}

/**
 * TagsInput Logic Definition契约
 */
export type TagsInputLogic = LogicDefinition<TagsInputProps, tagsInput.Api>
