import { computed } from 'vue'
import { tagsInputMachine, tagsInputConnect, type TagsInputApi, type TagsInputValueChangeDetails } from '@timui/core'
import { useMachine, normalizeProps } from '@zag-js/vue'

export type UseTagsInputProps = {
    id?: string
    value?: string[]
    defaultValue?: string[]
    inputValue?: string
    defaultInputValue?: string
    disabled?: boolean
    readOnly?: boolean
    invalid?: boolean
    max?: number
    allowOverflow?: boolean
    dir?: 'ltr' | 'rtl'
    onValueChange?: (details: TagsInputValueChangeDetails) => void
    onInputValueChange?: (details: { inputValue: string }) => void
    onHighlightChange?: (details: { highlightedValue: string | null }) => void
    onValueInvalid?: (details: { reason: string }) => void
}

export function useTagsInput(props: UseTagsInputProps) {
    const service = useMachine(tagsInputMachine, {
        id: props.id,
        value: props.value,
        defaultValue: props.defaultValue,
        inputValue: props.inputValue,
        defaultInputValue: props.defaultInputValue,
        disabled: props.disabled,
        readOnly: props.readOnly,
        invalid: props.invalid,
        max: props.max,
        allowOverflow: props.allowOverflow,
        dir: props.dir,
        onValueChange: props.onValueChange,
        onInputValueChange: props.onInputValueChange,
        onHighlightChange: props.onHighlightChange,
        onValueInvalid: props.onValueInvalid,
    })

    return computed(() => tagsInputConnect(service, normalizeProps))
}
