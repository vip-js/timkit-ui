export type TimelineOrientation = 'horizontal' | 'vertical'
export type TimelineProps = {
    defaultValue?: number
    value?: number
    onValueChange?: (value: number) => void
    orientation?: TimelineOrientation
}
