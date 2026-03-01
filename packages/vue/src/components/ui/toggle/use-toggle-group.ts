import { computed, type ComputedRef } from 'vue'
import { toggleGroupMachine, toggleGroupConnect, type ToggleGroupApi } from '@timui/core'
import { useMachine, normalizeProps } from '@zag-js/vue'

export type UseToggleGroupProps = {
    id?: string
    value?: string[]
    defaultValue?: string[]
    disabled?: boolean
    multiple?: boolean
    loop?: boolean
    onValueChange?: (details: { value: string[] }) => void
}

export function useToggleGroup(props: UseToggleGroupProps) {
    const service = useMachine(toggleGroupMachine, {
        value: props.value,
        defaultValue: props.defaultValue,
        disabled: props.disabled,
        multiple: props.multiple,
        onValueChange: props.onValueChange,
    })

    return computed(() => toggleGroupConnect(service, normalizeProps))
}
