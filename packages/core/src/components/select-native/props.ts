export type SelectNativeProps = {
    options?: { label: string; value: string }[]
    value?: string | string[]
    defaultValue?: string | string[]
    multiple?: boolean
    onValueChange?: (value: string | string[]) => void
}

export type SelectNativeVueProps = {
    modelValue?: string | string[]
    defaultValue?: string | string[]
    multiple?: boolean
}
