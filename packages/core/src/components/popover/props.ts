import type * as popover from '@zag-js/popover'

export type PopoverProps = popover.Props & {
  /**
   * When true, opening the popover is ignored.
   */
  disabled?: boolean
}
