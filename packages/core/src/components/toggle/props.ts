import type { LogicDefinition, TimEvent } from '../../shared'

export type TogglePressedChangeEvent = TimEvent<{ pressed: boolean }>

export type ToggleProps = {
  /**
   * The controlled pressed state of the component.
   */
  pressed?: boolean
  /**
   * The default pressed state when initially rendered.
   */
  defaultPressed?: boolean
  /**
   * Callback fired when the pressed state changes.
   */
  onPressedChange?: (event: TogglePressedChangeEvent) => void
  /**
   * When `true`, prevents the user from interacting with the component.
   */
  disabled?: boolean
}

/**
 * Toggle Logic Definition契约
 */
export type ToggleLogic = LogicDefinition<ToggleProps, object>
