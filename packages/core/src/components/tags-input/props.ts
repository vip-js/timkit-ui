import type * as tagsInput from '@zag-js/tags-input'
import type { TimEvent, LogicDefinition } from '../../shared'

export type TagsInputValueChangeEvent = TimEvent<{ value: string[] }>

export type TagsInputProps = Omit<tagsInput.Props, 'onValueChange'> & {
    onValueChange?: (event: TagsInputValueChangeEvent) => void
}

export type TagsInputVueProps = {
    id?: string
    value?: string[]
    defaultValue?: string[]
    inputValue?: string
    defaultInputValue?: string
    disabled?: boolean
    readOnly?: boolean
    name?: string
    modelValue?: string[]
    onValueChange?: (details: { value: string[] }) => void
    onInputValueChange?: (details: { inputValue: string }) => void
}

/**
 * TagsInput Logic Definition契约
 */
export type TagsInputLogic = LogicDefinition<TagsInputProps, tagsInput.Api>
