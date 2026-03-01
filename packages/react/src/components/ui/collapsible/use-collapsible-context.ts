import * as React from 'react'
import type { collapsibleConnect } from '@timui/core'

export type CollapsibleContextValue = ReturnType<typeof collapsibleConnect>

const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(null)

export const CollapsibleProvider: React.Provider<CollapsibleContextValue | null> = CollapsibleContext.Provider

export function useCollapsibleContext(): CollapsibleContextValue {
    const context = React.useContext(CollapsibleContext)
    if (!context) {
        throw new Error('Collapsible components must be used within `<CollapsibleProvider />`')
    }
    return context
}
