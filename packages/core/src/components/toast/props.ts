import type * as toast from '@zag-js/toast'

import type { LogicDefinition } from '../../shared'

export interface ToastAction {
  /**
   * The text label displayed alongside or within the component.
   */
  label: string
  onClick: () => void
}

export type ToastProps = toast.Options & {
  /**
   * The visual style of the toast.
   */
  variant?: 'default' | 'destructive'
  /**
   * Whether the toast is open.
   */
  open?: boolean
  /**
   * Callback fired when the open state changes.
   */
  onOpenChange?: (open: boolean) => void
  /**
   * The primary title string or content.
   */
  title?: string
  /**
   * The supportive description string or content.
   */
  description?: string
  /**
   * The primary action configuration or component.
   */
  action?: ToastAction
}

/**
 * Toast Logic Definition契约
 */
export type ToastLogic = LogicDefinition<ToastProps, toast.Api>
