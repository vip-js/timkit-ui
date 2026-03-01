import * as React from 'react'
import type { SelectItemData } from './use-select'

export type SelectApiLike = {
    open?: boolean
    value?: string[]
    triggerProps?: React.HTMLAttributes<HTMLElement>
    positionerProps?: React.HTMLAttributes<HTMLElement> & { style?: React.CSSProperties }
    contentProps?: React.HTMLAttributes<HTMLElement>
    getItemProps?: (options: { item: SelectItemData }) => React.HTMLAttributes<HTMLElement>
}

export const SelectContext = React.createContext<SelectApiLike | null>(null)
export const SelectProvider = SelectContext.Provider

export function useSelectContext() {
    const context = React.useContext(SelectContext)
    if (!context) {
        throw new Error('useSelectContext must be used within a Select component')
    }
    return context
}
