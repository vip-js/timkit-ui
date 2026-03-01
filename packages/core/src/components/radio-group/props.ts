import type * as radioGroup from '@zag-js/radio-group'
import type { TimEvent, LogicDefinition } from '../../shared'

export type RadioGroupValueChangeEvent = TimEvent<{ value: string | null }>

export type RadioGroupProps = Omit<radioGroup.Props, 'onValueChange'> & {
    onValueChange?: (event: RadioGroupValueChangeEvent) => void
}

export type RadioGroupVueProps = {
    id?: string
    value?: string | null
    defaultValue?: string | null
    disabled?: boolean
    required?: boolean
    name?: string
    modelValue?: string | null
    onValueChange?: (details: { value: string | null }) => void
}

export type RadioGroupItemProps = radioGroup.ItemProps

/**
 * RadioGroup Logic Definition契约
 */
export type RadioGroupLogic = LogicDefinition<RadioGroupProps, radioGroup.Api>
