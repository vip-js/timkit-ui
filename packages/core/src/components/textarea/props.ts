import type { LogicDefinition } from '../../shared'
import type { TextInputProps } from '../input/props'

export type TextareaProps = Omit<TextInputProps, 'type'>

export type TextareaVueProps = Omit<TextareaProps, 'value' | 'defaultValue'> & {
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
 * Textarea Logic Definition契约
 */
export type TextareaLogic = LogicDefinition<TextareaProps, object>
