import type * as select from '@zag-js/select'
import type { ListCollection } from '@zag-js/collection'
import type { TimEvent, LogicDefinition } from '../../shared'

export interface SelectItem {
    label: string
    value: string
    disabled?: boolean
}

export type SelectValueChangeEvent = TimEvent<{ value: string[] }>

export type SelectProps = Omit<select.Props<SelectItem>, 'onValueChange'> & {
    onValueChange?: (event: SelectValueChangeEvent) => void
}

export type SelectVueProps = {
    id?: string
    collection?: ListCollection<SelectItem>
    value?: string
    defaultValue?: string
    modelValue?: string
    disabled?: boolean
    required?: boolean
    name?: string
    open?: boolean
    defaultOpen?: boolean
    onValueChange?: (details: { value: string[] }) => void
    onOpenChange?: (details: { open: boolean }) => void
}

/**
 * Select Logic Definition契约
 */
export type SelectLogic = LogicDefinition<SelectProps, object>
