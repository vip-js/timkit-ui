import type * as toggleGroup from '@zag-js/toggle-group'
import type { TimEvent, LogicDefinition } from '../../shared'

export type ToggleGroupValueChangeEvent = TimEvent<{ value: string[] }>

export type ToggleGroupProps = Omit<toggleGroup.Props, 'onValueChange'> & {
    onValueChange?: (event: ToggleGroupValueChangeEvent) => void
}

/**
 * ToggleGroup Logic Definition契约
 */
export type ToggleGroupLogic = LogicDefinition<ToggleGroupProps, toggleGroup.Api>
