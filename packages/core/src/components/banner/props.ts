export type BannerProps = {
  /**
   * Visual style of the banner message.
   */
  variant?: 'default' | 'success' | 'warning' | 'destructive'
  /**
   * Whether the banner can be dismissed by the user.
   */
  dismissible?: boolean
  /**
   * The controlled open state. `null` and omission leave the banner uncontrolled.
   */
  open?: boolean | null
  /**
   * The initial open state when uncontrolled.
   */
  defaultOpen?: boolean | null
  /**
   * Callback fired when the open state changes.
   */
  onOpenChange?: (open: boolean) => void
  /**
   * Callback fired when the component is closed or dismissed.
   */
  onClose?: () => void
}
