import type * as accordion from '@zag-js/accordion'

import type { LogicDefinition, TimEvent } from '../../shared'

export type AccordionValueChangeEvent = TimEvent<{ value: string | string[] }>

export type AccordionProps = Omit<accordion.Props, 'onValueChange'> & {
  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (event: AccordionValueChangeEvent) => void
}

/**
 * Accordion Logic Definition契约
 */
export type AccordionLogic = LogicDefinition<AccordionProps, accordion.Api>
