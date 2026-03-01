import type * as switch_ from '@zag-js/switch'
import type { TimEvent, LogicDefinition } from '../../shared'

export type SwitchCheckedChangeEvent = TimEvent<{ checked: boolean }>

export type SwitchProps = Omit<switch_.Props, 'onCheckedChange'> & {
    onCheckedChange?: (event: SwitchCheckedChangeEvent) => void
}

export type SwitchVueProps = {
    id?: string
    checked?: boolean
    defaultChecked?: boolean
    disabled?: boolean
    required?: boolean
    name?: string
    value?: string
    modelValue?: boolean
    onCheckedChange?: (details: { checked: boolean }) => void
}

/**
 * Switch Logic Definition契约
 */
export type SwitchLogic = LogicDefinition<SwitchProps, switch_.Api>
