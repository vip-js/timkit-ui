import * as React from 'react'
import type { useTooltip } from './use-tooltip'

export type UseTooltipReturn = ReturnType<typeof useTooltip>

const TooltipContext = React.createContext<UseTooltipReturn | null>(null)

export function TooltipContextProvider({ children, value }: { children: React.ReactNode; value: UseTooltipReturn }) {
    return <TooltipContext.Provider value={value}>{children}</TooltipContext.Provider>
}

export function useTooltipContext() {
    const context = React.useContext(TooltipContext)
    if (!context) {
        throw new Error('useTooltipContext must be used within a TooltipProvider')
    }
    return context
}
