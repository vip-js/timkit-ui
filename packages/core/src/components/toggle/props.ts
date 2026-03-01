import type { TimEvent, LogicDefinition } from '../../shared'

export type TogglePressedChangeEvent = TimEvent<{ pressed: boolean }>

export type ToggleProps = {
    pressed?: boolean
    defaultPressed?: boolean
    onPressedChange?: (event: TogglePressedChangeEvent) => void
    disabled?: boolean
}

/**
 * Toggle Logic Definition契约
 */
export type ToggleLogic = LogicDefinition<ToggleProps, object>
