import type * as tabs from '@zag-js/tabs'
import type { TimEvent, LogicDefinition } from '../../shared'

export type TabsValueChangeEvent = TimEvent<{ value: string }>

export type TabsProps = Omit<tabs.Props, 'onValueChange'> & {
    onValueChange?: (event: TabsValueChangeEvent) => void
}

/**
 * Tabs Logic Definition契约
 */
export type TabsLogic = LogicDefinition<TabsProps, tabs.Api>
