export type MultiselectOption = {
    value: string
    label: string
    disable?: boolean
    fixed?: boolean
    [key: string]: string | number | boolean | null | undefined | object
}

export type MultiselectProps = {
    value?: MultiselectOption[]
    defaultOptions?: MultiselectOption[]
    options?: MultiselectOption[]
    placeholder?: string
    delay?: number
    disabled?: boolean
    maxSelected?: number
    hidePlaceholderWhenSelected?: boolean
    groupBy?: string
    selectFirstItem?: boolean
    creatable?: boolean
    triggerSearchOnFocus?: boolean
    hideClearAllButton?: boolean
    onValueChange?: (options: MultiselectOption[]) => void
    onSearch?: (value: string) => Promise<MultiselectOption[]>
    onSearchSync?: (value: string) => MultiselectOption[]
    onMaxSelected?: (count: number) => void
}

export type MultiselectVueProps = {
    modelValue?: MultiselectOption[]
    defaultOptions?: MultiselectOption[]
    options?: MultiselectOption[]
    placeholder?: string
    delay?: number
    disabled?: boolean
    maxSelected?: number
    hidePlaceholderWhenSelected?: boolean
    groupBy?: string
    selectFirstItem?: boolean
    creatable?: boolean
    triggerSearchOnFocus?: boolean
    hideClearAllButton?: boolean
    onSearch?: (value: string) => Promise<MultiselectOption[]>
    onSearchSync?: (value: string) => MultiselectOption[]
    onMaxSelected?: (count: number) => void
}
