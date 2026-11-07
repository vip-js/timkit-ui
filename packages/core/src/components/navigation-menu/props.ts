export type NavigationMenuProps = {
  /**
   * The orientation of the component.
   */
  orientation?: 'horizontal' | 'vertical'
  /** Value of the open menu item. */
  value?: string
  /**
   * When true, opening a menu item is ignored.
   */
  disabled?: boolean
  /** Called when the open item changes. */
  onValueChange?: (value: string | null) => void
}
