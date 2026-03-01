import type * as checkbox from '@zag-js/checkbox'
import type { TimEvent, LogicDefinition } from '../../shared'

export type CheckboxCheckedChangeEvent = TimEvent<{ checked: checkbox.CheckedState }>

export type CheckboxProps = Omit<checkbox.Props, 'onCheckedChange'> & {
    onCheckedChange?: (event: CheckboxCheckedChangeEvent) => void
}

export type CheckboxCheckedState = boolean | 'indeterminate'

export type CheckboxVueProps = {
    id?: string
    checked?: CheckboxCheckedState
    defaultChecked?: CheckboxCheckedState
    disabled?: boolean
    required?: boolean
    readOnly?: boolean
    name?: string
    value?: string
    modelValue?: CheckboxCheckedState
    onCheckedChange?: (details: { checked: CheckboxCheckedState }) => void
}

/**
 * Checkbox Logic Definition契约
 */
export type CheckboxLogic = LogicDefinition<CheckboxProps, checkbox.Api>
