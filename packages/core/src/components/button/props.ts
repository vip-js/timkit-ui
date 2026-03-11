import type { LogicDefinition, TimEvent } from '../../shared'

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'

export type ButtonPressEvent = TimEvent

export type ButtonProps = {
  /**
   * The text label displayed alongside or within the component.
   */
  label?: string
  /**
   * The visual style variant of the component.
   */
  variant?: ButtonVariant
  /**
   * The visual size of the component.
   */
  size?: ButtonSize
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   */
  asChild?: boolean
  /**
   * When `true`, prevents the user from interacting with the component.
   */
  disabled?: boolean
  /**
   * When `true`, displays a loading spinner and prevents interaction.
   */
  loading?: boolean
  /**
   * Event handler called when the component is pressed or clicked.
   */
  onPress?: (event: ButtonPressEvent) => void
}

/**
 * Button Logic Definition契约
 */
export type ButtonLogic = LogicDefinition<ButtonProps, object> // Button has no complex api
