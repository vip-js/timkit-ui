import type { TextInputProps } from '../input/props'
import type { LogicDefinition } from '../../shared'

export type TextareaProps = Omit<TextInputProps, 'type'>

export type TextareaVueProps = Omit<TextareaProps, 'value' | 'defaultValue' | 'onValueChange'> & {
    modelValue?: string | number
    value?: string | number
    defaultValue?: string | number
}

/**
 * Textarea Logic Definition契约
 */
export type TextareaLogic = LogicDefinition<TextareaProps, object>
