import type { DialogVueProps } from '../dialog/props'

export type SheetProps = DialogVueProps & {
  /**
   * The edge the sheet slides in from.
   */
  side?: 'top' | 'bottom' | 'left' | 'right'
}
