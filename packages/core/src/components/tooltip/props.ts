import type * as tooltip from '@zag-js/tooltip'

export type TooltipProps = tooltip.Props & {
  /**
   * How long the pointer must hover before the tooltip opens.
   */
  delayDuration?: number
}
