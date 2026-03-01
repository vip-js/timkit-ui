import type * as combobox from '@zag-js/combobox'
import type { ListCollection } from '@zag-js/collection'
import type { TimEvent, LogicDefinition } from '../../shared'

export interface ComboboxItem {
    label: string
    value: string
    disabled?: boolean
}

export type ComboboxValueChangeEvent = TimEvent<{ value: string[] }>

export type ComboboxProps = Omit<combobox.Props<ComboboxItem>, 'onValueChange'> & {
    onValueChange?: (event: ComboboxValueChangeEvent) => void
}

export type ComboboxVueProps = {
    id?: string
    collection?: ListCollection<ComboboxItem>
    value?: string[]
    defaultValue?: string[]
    inputValue?: string
    defaultInputValue?: string
    open?: boolean
    defaultOpen?: boolean
    disabled?: boolean
    readOnly?: boolean
    name?: string
    onValueChange?: (details: { value: string[] }) => void
    onInputValueChange?: (details: { inputValue: string }) => void
    onOpenChange?: (details: { open: boolean }) => void
}

export type ItemProps = combobox.ItemProps
export type ItemGroupProps = combobox.ItemGroupProps
export type ItemGroupLabelProps = combobox.ItemGroupLabelProps

/**
 * Combobox Logic Definition契约
 */
export type ComboboxLogic = LogicDefinition<ComboboxProps, object>
