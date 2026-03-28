import type * as dialog from '@zag-js/dialog'

import type { LogicDefinition, TimEvent } from '../../shared'

export type DialogOpenChangeEvent = TimEvent<{ open: boolean }>

export type DialogProps = Omit<dialog.Props, 'onOpenChange'> & {
  /**
   * Callback fired when the open state changes.
   */
  onOpenChange?: (event: DialogOpenChangeEvent) => void
}

export type DialogVueProps = {
  /**
   * A unique identifier for the component.
   */
  id?: string
  /**
   * The controlled open state of the component.
   */
  open?: boolean
  /**
   * The default open state of the component when initially rendered.
   */
  defaultOpen?: boolean
  /**
   * When `true`, renders the overlay as a modal, trapping focus and disabling interactions outside.
   */
  modal?: boolean
  /**
   * Callback fired when the open state changes.
   */
  onOpenChange?: (open: boolean) => void
}

/**
 * Dialog Logic Definition契约
 */
export type DialogLogic = LogicDefinition<DialogProps, dialog.Api>
