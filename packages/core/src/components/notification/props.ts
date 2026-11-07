export type NotificationProps = {
  /**
   * Visual priority level for the notification.
   */
  variant?: 'default' | 'info' | 'success' | 'warning' | 'destructive'
  /**
   * Auto dismiss duration in milliseconds.
   */
  duration?: number
  /**
   * Whether users can manually close the notification.
   */
  closable?: boolean
  /**
   * The controlled open state. `null` and omission leave the notification uncontrolled.
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
