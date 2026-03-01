import type { TimEvent, LogicDefinition } from '../../shared'

export type ButtonVariant =
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'

export type ButtonPressEvent = TimEvent

export type ButtonProps = {
    label?: string
    variant?: ButtonVariant
    size?: ButtonSize
    asChild?: boolean
    disabled?: boolean
    loading?: boolean
    onPress?: (event: ButtonPressEvent) => void
}

/**
 * Button Logic Definition契约
 */
export type ButtonLogic = LogicDefinition<ButtonProps, object> // Button has no complex api
