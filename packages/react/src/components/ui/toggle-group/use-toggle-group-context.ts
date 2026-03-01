import * as React from 'react'
import type { toggleGroupConnect, ToggleVariants } from '@timui/core'

export interface ToggleGroupContextValue {
    api: ReturnType<typeof toggleGroupConnect>
    size?: ToggleVariants['size']
    variant?: ToggleVariants['variant']
    type: "single" | "multiple"
    disabled?: boolean
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue | null>(null)

export const ToggleGroupProvider: React.Provider<ToggleGroupContextValue | null> = ToggleGroupContext.Provider

export function useToggleGroupContext(): ToggleGroupContextValue {
    const context = React.useContext(ToggleGroupContext)
    if (!context) {
        throw new Error('ToggleGroup components must be used within `<ToggleGroupProvider />`')
    }
    return context
}
