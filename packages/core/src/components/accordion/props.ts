import type * as accordion from '@zag-js/accordion'

import type { LogicDefinition, TimEvent } from '../../shared'

export type AccordionValueChangeEvent = TimEvent<{ value: string | string[] }>

export type AccordionProps = Omit<accordion.Props, 'id' | 'value' | 'defaultValue' | 'onValueChange'> & {
  id?: string
  value?: string | string[] | null
  defaultValue?: string | string[]
  /**
   * Whether one item or several items can be open.
   */
  type?: 'single' | 'multiple'
  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (event: AccordionValueChangeEvent) => void
}

/**
 * Accordion Logic Definition契约
 */
export type AccordionLogic = LogicDefinition<AccordionProps, accordion.Api>
