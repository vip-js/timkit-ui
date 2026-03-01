export type CommandProps = {
    label?: string
    shouldFilter?: boolean
    filter?: (value: string, search: string) => number
    defaultValue?: string
    value?: string
    onValueChange?: (value: string) => void
    onKeyDown?: (event: { key: string, target: { value: string } }) => void
}
