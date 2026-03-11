export type TimelineOrientation = 'horizontal' | 'vertical'
export type TimelineProps = {
  /**
   * The default value of the component when uncontrolled.
   */
  defaultValue?: number
  /**
   * The controlled value of the component.
   */
  value?: number
  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (value: number) => void
  /**
   * The orientation of the component.
   */
  orientation?: TimelineOrientation
}
