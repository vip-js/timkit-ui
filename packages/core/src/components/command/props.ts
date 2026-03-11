export type CommandProps = {
  /**
   * The text label displayed alongside or within the component.
   */
  label?: string
  /**
   * When `true`, applies the default built-in filter logic to options.
   */
  shouldFilter?: boolean
  /**
   * Custom filter function to match user input against options.
   */
  filter?: (value: string, search: string) => number
  /**
   * The default value of the component when uncontrolled.
   */
  defaultValue?: string
  /**
   * The controlled value of the component.
   */
  value?: string
  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (value: string) => void
  /**
   * Event handler called when a key is pressed down.
   */
  onKeyDown?: (event: { key: string; target: { value: string } }) => void
}
